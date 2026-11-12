import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"
import { sendUserEmail } from "@/lib/resend"
import { portalInvite } from "@/lib/mentorship/email-templates"

const SITE_URL = process.env.SITE_URL || "https://teeshouse.org"
const REDIRECT_TO = `${SITE_URL}/mentorship/portal/set-password`

/**
 * Gives an approved mentor or intern portal access and emails them a link.
 *
 * New people get an invite link from supabase.auth.admin.generateLink,
 * which creates the auth.users row WITHOUT Supabase sending its own email,
 * so we send a branded one through Resend.
 *
 * Two cases the plain invite can't handle, both handled here:
 *  - The email already has a login (for example a staff member who is also
 *    a mentor): the account is linked to the profile and a set-password
 *    link is emailed instead.
 *  - The person already has a portal account but never got (or lost) the
 *    email: send `resend: true` to email them a fresh link.
 *
 * The response always says whether the email actually went out, because the
 * email helper never throws and a silent failure leaves the person waiting.
 *
 * For a minor intern the link goes to the intern's own application email,
 * not the parent's; parents only get the one-time consent flow.
 */
async function findAuthUserByEmail(email: string) {
  const target = email.toLowerCase()
  const perPage = 200
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage })
    if (error || !data?.users?.length) return null
    const hit = data.users.find(u => u.email?.toLowerCase() === target)
    if (hit) return hit
    if (data.users.length < perPage) return null
  }
  return null
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { id, role, resend } = await req.json()
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
      { error: "Cannot activate: this intern is a minor without confirmed parental consent." },
      { status: 400 }
    )
  }

  if (profile.auth_user_id && !resend) {
    return NextResponse.json(
      { error: "This person already has a portal account. Use Resend Invite to email them a new link." },
      { status: 400 }
    )
  }

  let authUserId: string | null = profile.auth_user_id
  let actionLink: string | null = null

  if (!authUserId) {
    const { data: invite, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: profile.email,
      options: { redirectTo: REDIRECT_TO },
    })

    if (invite?.user && !inviteError) {
      authUserId = invite.user.id
      actionLink = invite.properties.action_link
    } else {
      const alreadyRegistered =
        inviteError?.code === "email_exists" || /already.*(registered|exists)/i.test(inviteError?.message || "")
      if (!alreadyRegistered) {
        console.error("generateLink invite error:", JSON.stringify(inviteError))
        return NextResponse.json({ error: "Failed to create portal account" }, { status: 500 })
      }
      const existing = await findAuthUserByEmail(profile.email)
      if (!existing || !existing.email_confirmed_at) {
        return NextResponse.json(
          { error: "A login already exists for this email but could not be linked. Check the account in Supabase." },
          { status: 409 }
        )
      }
      authUserId = existing.id
    }

    const { error: updateError } = await supabaseAdmin
      .from(table)
      .update({ auth_user_id: authUserId, status: "active", updated_at: new Date().toISOString() })
      .eq("id", id)

    if (updateError) {
      console.error("Activate link-back error:", JSON.stringify(updateError))
      return NextResponse.json({ error: "Account created but failed to link profile. Contact support." }, { status: 500 })
    }
  }

  if (!actionLink) {
    const { data: recovery, error: recoveryError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: profile.email,
      options: { redirectTo: REDIRECT_TO },
    })
    if (recoveryError || !recovery?.properties?.action_link) {
      console.error("generateLink recovery error:", JSON.stringify(recoveryError))
      return NextResponse.json({ error: "Account is linked, but a new access link could not be created. Try Resend Invite." }, { status: 500 })
    }
    actionLink = recovery.properties.action_link
  }

  const emailContent = portalInvite({ firstName: profile.first_name, inviteActionLink: actionLink })
  const emailSent = await sendUserEmail({ to: profile.email, ...emailContent })
  if (!emailSent) {
    console.error(`Portal invite email to ${profile.email} was not delivered (role: ${role})`)
  }

  return NextResponse.json({ success: true, emailSent, authUserId })
}
