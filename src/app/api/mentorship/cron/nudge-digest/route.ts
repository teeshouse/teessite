import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireCronOrAdmin } from "@/lib/mentorship/auth-guard"
import { sendUserEmail, NOTIFY } from "@/lib/resend"
import { mentorWeeklyNudge, leadershipCohortDigest } from "@/lib/mentorship/email-templates"

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Daily-invoked cron that only actually sends on Mondays — this is how
 * ITGC's two separate "weekly" routes (mentor-nudge, digest) get
 * consolidated into one path to fit Vercel Hobby's one-cron-per-path/day
 * limit while still running weekly in effect.
 */
export async function GET(req: NextRequest) {
  const { error } = await requireCronOrAdmin(req)
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const isMonday = new Date().getUTCDay() === 1
  const force = req.nextUrl.searchParams.get("force") === "true"
  if (!isMonday && !force) {
    return NextResponse.json({ ok: true, skipped: "not Monday" })
  }

  const { data: activePairs, error: dbError } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`id, status, last_session_at, mentor:mentors(id, first_name, email), mentee:mentorship_applications(id, first_name, last_name)`)
    .eq("status", "active")

  if (dbError) {
    console.error("Nudge-digest cron query error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Query failed" }, { status: 500 })
  }

  const pairs = activePairs || []
  const now = Date.now()

  // ── Per-mentor weekly nudge ──────────────────────────────────────────
  interface MentorSummary { menteeName: string; status: string; daysSinceLastSession: number | null }
  interface MentorEntry { email: string; firstName: string; summaries: MentorSummary[] }
  const byMentor = new Map<string, MentorEntry>()

  for (const pair of pairs) {
    const mentor = Array.isArray(pair.mentor) ? pair.mentor[0] : pair.mentor
    const mentee = Array.isArray(pair.mentee) ? pair.mentee[0] : pair.mentee
    if (!mentor || !mentee) continue

    const days = pair.last_session_at ? Math.floor((now - new Date(pair.last_session_at).getTime()) / DAY_MS) : null
    const status = days === null ? "no sessions yet" : days > 21 ? "needs attention" : "on track"

    const entry: MentorEntry = byMentor.get(mentor.id) || { email: mentor.email, firstName: mentor.first_name, summaries: [] }
    entry.summaries.push({ menteeName: `${mentee.first_name} ${mentee.last_name}`, status, daysSinceLastSession: days })
    byMentor.set(mentor.id, entry)
  }

  let mentorEmailsSent = 0
  for (const mentor of Array.from(byMentor.values())) {
    const content = mentorWeeklyNudge({ mentorName: mentor.firstName, pairSummaries: mentor.summaries })
    const ok = await sendUserEmail({ to: mentor.email, ...content })
    if (ok) mentorEmailsSent++
  }

  // ── Leadership digest ─────────────────────────────────────────────────
  const needsAttention = pairs
    .map(p => {
      const mentor = Array.isArray(p.mentor) ? p.mentor[0] : p.mentor
      const mentee = Array.isArray(p.mentee) ? p.mentee[0] : p.mentee
      const days = p.last_session_at ? Math.floor((now - new Date(p.last_session_at).getTime()) / DAY_MS) : null
      return { mentor, mentee, days }
    })
    .filter(p => p.mentor && p.mentee && p.days !== null && p.days >= 21)
    .map(p => ({ mentorName: `${p.mentor!.first_name}`, menteeName: `${p.mentee!.first_name} ${p.mentee!.last_name}`, daysSinceLastSession: p.days! }))

  const digestContent = leadershipCohortDigest({
    cohortName: "All Active Pairs",
    totalPairs: pairs.length,
    activePairs: pairs.length,
    needsAttention,
  })
  await sendUserEmail({ to: NOTIFY, ...digestContent })

  return NextResponse.json({ ok: true, mentorEmailsSent, needsAttentionCount: needsAttention.length })
}
