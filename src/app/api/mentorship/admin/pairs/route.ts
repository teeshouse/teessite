import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`*, mentor:mentors(id, first_name, last_name, email), mentee:mentorship_applications(id, first_name, last_name, email, is_minor)`)
    .order("created_at", { ascending: false })

  if (dbError) {
    console.error("Pairs list error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to load pairs" }, { status: 500 })
  }
  return NextResponse.json({ pairs: data })
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { mentorId, menteeId, cohortId } = await req.json()
  if (!mentorId || !menteeId) {
    return NextResponse.json({ error: "mentorId and menteeId are required" }, { status: 400 })
  }

  // Explicit app-level check ahead of the DB trigger (supabase/migrations/
  // 0001_mentorship_schema.sql: enforce_minor_consent) so an unconsented
  // minor gets a clear 400 instead of a raw Postgres error.
  const { data: mentee, error: menteeError } = await supabaseAdmin
    .from("mentorship_applications")
    .select("is_minor, parent_consent, consent_expires_at")
    .eq("id", menteeId)
    .maybeSingle()

  if (menteeError || !mentee) {
    return NextResponse.json({ error: "Mentee not found" }, { status: 404 })
  }

  if (mentee.is_minor) {
    const expired = !mentee.consent_expires_at || new Date(mentee.consent_expires_at) < new Date()
    if (!mentee.parent_consent || expired) {
      return NextResponse.json(
        { error: "Cannot pair: parent consent has not been received or has expired for this mentee." },
        { status: 400 }
      )
    }
  }

  const { data: mentor, error: mentorError } = await supabaseAdmin
    .from("mentors")
    .select("max_mentees")
    .eq("id", mentorId)
    .maybeSingle()

  if (mentorError || !mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
  }

  const { count: activePairCount } = await supabaseAdmin
    .from("mentorship_pairs")
    .select("*", { count: "exact", head: true })
    .eq("mentor_id", mentorId)
    .eq("status", "active")

  if ((activePairCount ?? 0) >= mentor.max_mentees) {
    return NextResponse.json({ error: "This mentor is already at their max mentee capacity." }, { status: 400 })
  }

  const { data: pair, error: dbError } = await supabaseAdmin
    .from("mentorship_pairs")
    .insert([{
      mentor_id: mentorId,
      mentee_id: menteeId,
      cohort_id: cohortId || null,
      assigned_by: user.id,
      status: "active",
      started_at: new Date().toISOString(),
    }])
    .select("*")
    .single()

  if (dbError) {
    console.error("Pair create error:", JSON.stringify(dbError))
    // The trigger raising here means the app-level check above missed a
    // case — still surface a readable message rather than the raw error.
    return NextResponse.json({ error: dbError.message || "Failed to create pair" }, { status: 500 })
  }

  await supabaseAdmin
    .from("mentorship_applications")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .eq("id", menteeId)

  return NextResponse.json({ pair })
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { id, status, flagged, flagReason } = await req.json()
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status
  if (status === "completed" || status === "ended_early") updates.ended_at = new Date().toISOString()
  if (typeof flagged === "boolean") updates.flagged = flagged
  if (flagReason !== undefined) updates.flag_reason = flagReason

  const { error: dbError } = await supabaseAdmin.from("mentorship_pairs").update(updates).eq("id", id)

  if (dbError) {
    console.error("Pair update error:", JSON.stringify(dbError))
    return NextResponse.json({ error: dbError.message || "Failed to update pair" }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
