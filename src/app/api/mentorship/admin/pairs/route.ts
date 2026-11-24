import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"
import { sendUserEmail } from "@/lib/resend"
import { pairingAnnouncement } from "@/lib/mentorship/email-templates"
import { pairingError } from "@/lib/mentorship/pairing-rules"

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

  // App-level checks ahead of the DB trigger (supabase/migrations/
  // 0001_mentorship_schema.sql: enforce_minor_consent) so the admin gets a
  // clear 400 instead of a raw Postgres error. The rules live in
  // pairing-rules.ts so they can be tested without a database.
  const [{ data: mentee }, { data: mentor }] = await Promise.all([
    supabaseAdmin
      .from("mentorship_applications")
      .select("first_name, last_name, email, status, is_minor, parent_name, parent_email, parent_consent, consent_expires_at")
      .eq("id", menteeId)
      .maybeSingle(),
    supabaseAdmin
      .from("mentors")
      .select("first_name, last_name, email, status, max_mentees")
      .eq("id", mentorId)
      .maybeSingle(),
  ])

  const [mentorPairs, internPairs, cohortRow, cohortPairs] = await Promise.all([
    supabaseAdmin.from("mentorship_pairs").select("*", { count: "exact", head: true }).eq("mentor_id", mentorId).eq("status", "active"),
    supabaseAdmin.from("mentorship_pairs").select("*", { count: "exact", head: true }).eq("mentee_id", menteeId).eq("status", "active"),
    cohortId
      ? supabaseAdmin.from("mentorship_cohorts").select("name, status, max_pairs").eq("id", cohortId).maybeSingle()
      : Promise.resolve({ data: undefined }),
    cohortId
      ? supabaseAdmin.from("mentorship_pairs").select("*", { count: "exact", head: true }).eq("cohort_id", cohortId).eq("status", "active")
      : Promise.resolve({ count: 0 }),
  ])

  const rule = pairingError({
    mentor,
    intern: mentee,
    mentorActivePairs: mentorPairs.count ?? 0,
    internActivePairs: internPairs.count ?? 0,
    cohort: cohortId ? (cohortRow.data ?? null) : undefined,
    cohortActivePairs: cohortPairs.count ?? 0,
  })
  if (rule || !mentee || !mentor) {
    return NextResponse.json({ error: rule?.message ?? "Mentor or intern not found" }, { status: rule?.status ?? 404 })
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

  // Tell everyone involved. sendUserEmail never throws, so a failure here
  // must not undo the pair; report it so the admin can follow up.
  const cohortName = cohortRow.data?.name ?? null
  const mentorName = `${mentor.first_name} ${mentor.last_name}`
  const internName = `${mentee.first_name} ${mentee.last_name}`
  const sends = [
    sendUserEmail({ to: mentor.email, ...pairingAnnouncement({ recipientName: mentor.first_name, partnerName: internName, partnerRole: "intern", cohortName }) }),
    sendUserEmail({ to: mentee.email, ...pairingAnnouncement({ recipientName: mentee.first_name, partnerName: mentorName, partnerRole: "mentor", cohortName }) }),
  ]
  if (mentee.is_minor && mentee.parent_email) {
    sends.push(sendUserEmail({
      to: mentee.parent_email,
      ...pairingAnnouncement({ recipientName: mentee.parent_name || "there", partnerName: mentorName, partnerRole: "mentor", cohortName, onBehalfOf: mentee.first_name }),
    }))
  }
  const emailsSent = (await Promise.all(sends)).every(Boolean)
  if (!emailsSent) console.error(`Pairing notification emails were not all delivered for pair ${pair.id}`)

  return NextResponse.json({ pair, emailsSent })
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { id, status, flagged, flagReason } = await req.json()
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
  if (status && !["active", "completed", "ended_early"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status
  if (status === "completed" || status === "ended_early") updates.ended_at = new Date().toISOString()
  if (typeof flagged === "boolean") updates.flagged = flagged
  if (flagReason !== undefined) updates.flag_reason = typeof flagReason === "string" ? flagReason.slice(0, 1000) : null

  const { error: dbError } = await supabaseAdmin.from("mentorship_pairs").update(updates).eq("id", id)

  if (dbError) {
    console.error("Pair update error:", JSON.stringify(dbError))
    return NextResponse.json({ error: dbError.message || "Failed to update pair" }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
