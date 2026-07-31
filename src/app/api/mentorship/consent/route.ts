import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sendUserEmail, notifyInfo } from "@/lib/resend"
import { consentExpiresAt } from "@/lib/mentorship/consent-token"
import { parentConsentConfirmed } from "@/lib/mentorship/email-templates"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    // Defensive rate limit — the token itself is the real gate, but this is
    // a public POST endpoint like any other intake route.
    const ip = getClientIp(req)
    const gate = checkRateLimit(`consent:${ip}`, { limit: 10, windowMs: 5 * 60_000 })
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } }
      )
    }

    const { data: app, error: fetchError } = await supabaseAdmin
      .from("mentorship_applications")
      .select("id, first_name, last_name, parent_name, parent_email, parent_token_expires_at, parent_consent")
      .eq("parent_token", token)
      .maybeSingle()

    if (fetchError || !app) {
      return NextResponse.json({ error: "Invalid or expired consent link." }, { status: 404 })
    }
    if (app.parent_consent) {
      return NextResponse.json({ error: "Consent has already been confirmed for this application." }, { status: 409 })
    }
    if (!app.parent_token_expires_at || new Date(app.parent_token_expires_at) < new Date()) {
      return NextResponse.json({ error: "This consent link has expired. Please contact us for a new one." }, { status: 410 })
    }

    // Re-validate server-side at write time, never trust the earlier read alone.
    const { error: updateError } = await supabaseAdmin
      .from("mentorship_applications")
      .update({
        parent_consent: true,
        parent_consent_at: new Date().toISOString(),
        consent_expires_at: consentExpiresAt(),
        status: "reviewing",
      })
      .eq("parent_token", token)
      .eq("parent_consent", false)

    if (updateError) {
      console.error("Consent update error:", JSON.stringify(updateError))
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }

    const applicantName = `${app.first_name} ${app.last_name}`

    if (app.parent_email && app.parent_name) {
      const email_ = parentConsentConfirmed({ parentName: app.parent_name, applicantName })
      await sendUserEmail({ to: app.parent_email, ...email_ })
    }

    const requesterIp = getClientIp(req)
    await notifyInfo({
      subject: `Parent consent received: ${applicantName}`,
      intro: `${app.parent_name} confirmed parental consent for ${applicantName}'s mentorship application.`,
      fields: [
        { label: "Applicant", value: applicantName },
        { label: "Parent", value: `${app.parent_name} (${app.parent_email})` },
        { label: "Confirmed from IP", value: requesterIp },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Consent API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
