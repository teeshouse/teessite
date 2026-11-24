import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { cleanText, cleanDate, cleanInt, cleanList } from "@/lib/mentorship/input"

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

  const body = await req.json()
  const sessionDate = cleanDate(body.sessionDate)
  if (!sessionDate) return NextResponse.json({ error: "Please choose a valid session date" }, { status: 400 })
  const nextSessionDate = body.nextSessionDate ? cleanDate(body.nextSessionDate) : null
  if (body.nextSessionDate && !nextSessionDate) return NextResponse.json({ error: "Please choose a valid next session date" }, { status: 400 })
  const durationMins = cleanInt(body.durationMins, 1, 600)
  const format = cleanText(body.format, 60)
  const topics = cleanList(body.topics, 20, 80)
  const summary = cleanText(body.summary, 5000)
  const actionItems = cleanText(body.actionItems, 3000)

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_sessions")
    .insert([{
      pair_id: pair.id,
      session_date: sessionDate,
      duration_mins: durationMins,
      format: format || null,
      topics,
      summary: summary || null,
      next_session_date: nextSessionDate,
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
