import type { NextRequest } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase"

interface GuardOk<T> { error: null; user: T }
interface GuardErr { error: { message: string; status: number }; user: null }
type GuardResult<T> = GuardOk<T> | GuardErr

/**
 * Call at the top of every admin-only API route. Middleware only checks
 * "is there a session" — this does the authoritative admin_users lookup,
 * so unauthenticated AND non-admin callers both get rejected here. This is
 * the direct fix for ITGC's GET/PATCH mentorship/mentors routes, which had
 * no auth guard at all.
 */
export async function requireAdmin(): Promise<GuardResult<{ id: string; email: string }>> {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: { message: "Not authenticated", status: 401 }, user: null }
  }

  const { data: admin } = await supabaseAdmin
    .from("admin_users")
    .select("id, email")
    .eq("auth_user_id", user.id)
    .maybeSingle()

  if (!admin) {
    return { error: { message: "Not authorized", status: 403 }, user: null }
  }

  return { error: null, user: admin }
}

interface PortalUser {
  authUserId: string
  role: "mentor" | "mentee"
  profileId: string
}

/**
 * Call at the top of every portal API route. Resolves whether the session
 * belongs to a mentor or a mentee profile; callers use `profileId` to scope
 * queries to that person's own pair (RLS is the backstop, this is the
 * primary check for clean error responses).
 */
export async function requirePortalUser(): Promise<GuardResult<PortalUser>> {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: { message: "Not authenticated", status: 401 }, user: null }
  }

  const [{ data: mentor }, { data: mentee }] = await Promise.all([
    supabaseAdmin.from("mentors").select("id").eq("auth_user_id", user.id).maybeSingle(),
    supabaseAdmin.from("mentorship_applications").select("id").eq("auth_user_id", user.id).maybeSingle(),
  ])

  if (mentor) {
    return { error: null, user: { authUserId: user.id, role: "mentor", profileId: mentor.id } }
  }
  if (mentee) {
    return { error: null, user: { authUserId: user.id, role: "mentee", profileId: mentee.id } }
  }

  return { error: { message: "No mentor or mentee profile linked to this account", status: 403 }, user: null }
}

/**
 * Cron routes accept EITHER a valid CRON_SECRET bearer header (Vercel Cron)
 * OR a valid admin session (the admin dashboard's manual-trigger buttons) —
 * mirrors ITGC's dual-path design so the same route serves both callers.
 */
export async function requireCronOrAdmin(req: NextRequest): Promise<GuardResult<{ via: "cron" | "admin" }>> {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.get("authorization") || ""
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return { error: null, user: { via: "cron" } }
  }

  const admin = await requireAdmin()
  if (!admin.error) {
    return { error: null, user: { via: "admin" } }
  }

  return { error: { message: "Not authorized", status: 401 }, user: null }
}
