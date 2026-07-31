import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"
import { sendUserEmail } from "@/lib/resend"
import { portalInvite } from "@/lib/mentorship/email-templates"

const SITE_URL = process.env.SITE_URL || "https://teeshouse.org"

/**
 * Creates a portal login for an approved mentor or mentee via
 * supabase.auth.admin.generateLink({type:'invite'}) — this creates the
 * auth.users row AND returns a one-time action_link WITHOUT Supabase
 * sending its own email, so we can send a branded invite via Resend
 * instead. This replaces ITGC's plaintext-temp-password-by-email flow.
 *
 * For a minor mentee, the invite goes to the mentee's own application
 * email (their portal login), not the parent's — parents only get the
 * one-time consent flow, not ongoing portal access.
 */
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { id, role } = await req.json()
  if (!id || (role !== "mentor" && role !== "mentee")) {
    return NextResponse.json({ error: "id and role ('mentor'|'mentee') are required" }, { status: 400 })
  }

  const table = role === "mentor" ? "mentors" : "mentorship_applications"
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from(table)
    .select("id, first_name, email, auth_user_id, status, is_minor, parent_consent")
    .eq("id", id)
    .maybeSingle()

  if (fetchError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  if (role === "mentee" && profile.is_minor && !profile.parent_consent) {
    return NextResponse.json(
      { error: "Cannot activate: this mentee is a minor without confirmed parental consent." },
      { status: 400 }
    )
  }

  if (profile.auth_user_id) {
    return NextResponse.json({ error: "This person already has a portal account." }, { status: 400 })
  }

  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "invite",
    email: profile.email,
    options: { redirectTo: `${SITE_URL}/mentorship/portal/set-password` },
  })

  if (linkError || !linkData?.user) {
    console.error("generateLink error:", JSON.stringify(linkError))
    return NextResponse.json({ error: "Failed to create portal account" }, { status: 500 })
  }

  const newStatus = role === "mentor" ? "active" : "active"
  const { error: updateError } = await supabaseAdmin
    .from(table)
    .update({ auth_user_id: linkData.user.id, status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (updateError) {
    console.error("Activate link-back error:", JSON.stringify(updateError))
    return NextResponse.json({ error: "Account created but failed to link profile. Contact support." }, { status: 500 })
  }

  const emailContent = portalInvite({
    firstName: profile.first_name,
    inviteActionLink: linkData.properties.action_link,
  })
  await sendUserEmail({ to: profile.email, ...emailContent })

  return NextResponse.json({ success: true })
}
