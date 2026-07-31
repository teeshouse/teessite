import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"

export async function GET() {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ sessions: [] })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_sessions")
    .select("*")
    .eq("pair_id", pair.id)
    .order("session_date", { ascending: false })

  if (dbError) return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 })
  return NextResponse.json({ sessions: data })
}

export async function POST(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const { sessionDate, durationMins, format, topics, summary, nextSessionDate, actionItems } = await req.json()
  if (!sessionDate) return NextResponse.json({ error: "sessionDate is required" }, { status: 400 })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_sessions")
    .insert([{
      pair_id: pair.id,
      session_date: sessionDate,
      duration_mins: durationMins || null,
      format: format || null,
      topics: topics || [],
      summary: summary || null,
      next_session_date: nextSessionDate || null,
      action_items: actionItems || null,
      logged_by: user.authUserId,
    }])
    .select("*")
    .single()

  if (dbError) {
    console.error("Session log error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to log session" }, { status: 500 })
  }

  // Best-effort — a failure here shouldn't fail the whole request.
  const { error: rpcError } = await supabaseAdmin.rpc("increment_session_count", { pair_id: pair.id })
  if (rpcError) console.error("increment_session_count RPC failed:", rpcError)

  return NextResponse.json({ session: data })
}
