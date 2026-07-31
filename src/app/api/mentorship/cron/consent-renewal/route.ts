import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireCronOrAdmin } from "@/lib/mentorship/auth-guard"
import { sendUserEmail } from "@/lib/resend"
import { consentExpiringSoon } from "@/lib/mentorship/email-templates"
import { generateParentToken, parentTokenExpiresAt } from "@/lib/mentorship/consent-token"

const SITE_URL = process.env.SITE_URL || "https://teeshouse.org"

/**
 * Daily sweep: finds minor applicants whose parental consent expires within
 * 30 days, regenerates a fresh parent_token, and re-sends the consent
 * request as a renewal. If consent actually lapses on an active pair, the
 * DB trigger (enforce_minor_consent) blocks any further status change on
 * that pair, but doesn't auto-terminate it — this shows up in the weekly
 * leadership digest as a "needs attention" style item for manual review.
 */
export async function GET(req: NextRequest) {
  const { error } = await requireCronOrAdmin(req)
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const thirtyDaysOut = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: applications, error: dbError } = await supabaseAdmin
    .from("mentorship_applications")
    .select("id, first_name, last_name, parent_name, parent_email, consent_expires_at")
    .eq("is_minor", true)
    .eq("parent_consent", true)
    .not("consent_expires_at", "is", null)
    .lte("consent_expires_at", thirtyDaysOut)

  if (dbError) {
    console.error("Consent-renewal cron query error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Query failed" }, { status: 500 })
  }

  let sent = 0
  for (const app of applications || []) {
    if (!app.parent_email || !app.parent_name) continue

    const token = generateParentToken()
    const { error: updateError } = await supabaseAdmin
      .from("mentorship_applications")
      .update({ parent_token: token, parent_token_expires_at: parentTokenExpiresAt() })
      .eq("id", app.id)

    if (updateError) {
      console.error("Consent renewal token update error:", JSON.stringify(updateError))
      continue
    }

    const content = consentExpiringSoon({
      parentName: app.parent_name,
      applicantName: `${app.first_name} ${app.last_name}`,
      renewUrl: `${SITE_URL}/mentorship/consent/${token}`,
    })
    const ok = await sendUserEmail({ to: app.parent_email, ...content })
    if (ok) sent++
  }

  return NextResponse.json({ ok: true, renewalEmailsSent: sent })
}
