import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireCronOrAdmin } from "@/lib/mentorship/auth-guard"
import { signCheckinToken } from "@/lib/mentorship/checkin-sign"
import { sendUserEmail } from "@/lib/resend"
import { sessionCheckinPulse } from "@/lib/mentorship/email-templates"

const SITE_URL = process.env.SITE_URL || "https://teeshouse.org"

/**
 * Daily idempotent sweep (not a literal "every day send" — see vercel.json
 * comment): finds active pairs started 25-30 days ago that haven't had a
 * pulse email sent yet, and emails both mentor and mentee 5 one-click
 * HMAC-signed rating links. Runs once per pair via checkin_sent_at, so a
 * daily cron invocation is safe even though Hobby-plan crons can't target
 * an exact "day 28" schedule.
 */
export async function GET(req: NextRequest) {
  const { error } = await requireCronOrAdmin(req)
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const now = Date.now()
  const windowStart = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()
  const windowEnd = new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString()

  const { data: pairs, error: dbError } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`id, started_at, mentor:mentors(first_name, email), mentee:mentorship_applications(first_name, email)`)
    .eq("status", "active")
    .is("checkin_sent_at", null)
    .gte("started_at", windowStart)
    .lte("started_at", windowEnd)

  if (dbError) {
    console.error("Checkin cron query error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Query failed" }, { status: 500 })
  }

  let sent = 0
  for (const pair of pairs || []) {
    const mentor = Array.isArray(pair.mentor) ? pair.mentor[0] : pair.mentor
    const mentee = Array.isArray(pair.mentee) ? pair.mentee[0] : pair.mentee
    if (!mentor || !mentee) continue

    for (const [role, recipient] of [["mentor", mentor], ["mentee", mentee]] as const) {
      const links = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        url: `${SITE_URL}/api/mentorship/checkin/respond?token=${signCheckinToken({ pairId: pair.id, role, rating })}`,
      }))
      const content = sessionCheckinPulse({ recipientName: recipient.first_name, role, ratingLinks: links })
      await sendUserEmail({ to: recipient.email, ...content })
    }

    await supabaseAdmin
      .from("mentorship_pairs")
      .update({ checkin_sent_at: new Date().toISOString() })
      .eq("id", pair.id)

    sent++
  }

  return NextResponse.json({ ok: true, pairsSent: sent })
}
