import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { cleanText, cleanDate } from "@/lib/mentorship/input"

export async function GET() {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ goals: [] })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_goals")
    .select("*")
    .eq("pair_id", pair.id)
    .order("created_at", { ascending: false })

  if (dbError) return NextResponse.json({ error: "Failed to load goals" }, { status: 500 })
  return NextResponse.json({ goals: data })
}

export async function POST(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const body = await req.json()
  const title = cleanText(body.title, 200)
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 })
  const description = cleanText(body.description, 2000)
  const targetDate = body.targetDate ? cleanDate(body.targetDate) : null
  if (body.targetDate && !targetDate) return NextResponse.json({ error: "Please choose a valid target date" }, { status: 400 })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_goals")
    .insert([{ pair_id: pair.id, title, description: description || null, target_date: targetDate, created_by: user.authUserId }])
    .select("*")
    .single()

  if (dbError) return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  return NextResponse.json({ goal: data })
}

export async function PATCH(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const { id, status } = await req.json()
  if (!id || typeof id !== "string" || !status) return NextResponse.json({ error: "id and status are required" }, { status: 400 })
  if (!["in_progress", "completed", "dropped"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === "completed") updates.completed_at = new Date().toISOString()

  // Scope the update to this pair's own goal — a portal user's pair_id is
  // derived server-side above, not client-supplied, so this can't cross
  // into another pair's data even without relying solely on RLS.
  const { error: dbError } = await supabaseAdmin.from("mentorship_goals").update(updates).eq("id", id).eq("pair_id", pair.id)

  if (dbError) return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  return NextResponse.json({ success: true })
}
