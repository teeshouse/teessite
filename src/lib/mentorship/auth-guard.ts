import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import { SESSION_COOKIE } from "@/lib/mentorship/session-cookie"

interface GuardOk<T> { error: null; user: T }
interface GuardErr { error: { message: string; status: number }; user: null }
type GuardResult<T> = GuardOk<T> | GuardErr

/**
 * Reads the raw access-token cookie set by /api/mentorship/auth/login and
 * validates it directly against Supabase's Auth server. No @supabase/ssr
 * cookie codec involved — see the login route's comment for why that was
 * dropped (a known unresolved upstream incompatibility with Next.js's
 * cookies() API that caused "Auth session missing!" despite a present,
 * valid-looking cookie).
 */
async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

/**
 * Call at the top of every admin-only API route and the admin layout. Does
 * the authoritative admin_users lookup, so unauthenticated AND non-admin
 * callers both get rejected here. This is the direct fix for ITGC's
 * GET/PATCH mentorship/mentors routes, which had no auth guard at all.
 */
export async function requireAdmin(): Promise<GuardResult<{ id: string; email: string }>> {
  const user = await getSessionUser()

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
  const user = await getSessionUser()

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
