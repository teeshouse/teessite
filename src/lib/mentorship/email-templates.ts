import { escapeHtml, BRAND } from "@/lib/resend"

const SITE_URL = process.env.SITE_URL || "https://teeshouse.org"

interface EmailContent {
  subject: string
  heading: string
  bodyHtml: string
  bodyText: string
  cta?: { label: string; href: string }
}

export function parentConsentRequest(args: {
  parentName: string
  applicantName: string
  consentUrl: string
  isRenewal?: boolean
}): EmailContent {
  const verb = args.isRenewal ? "renew consent for" : "confirm consent for"
  return {
    subject: args.isRenewal
      ? `Please renew your consent for ${args.applicantName}'s mentorship`
      : `Parental consent needed for ${args.applicantName}'s mentorship application`,
    heading: args.isRenewal ? "Please renew your consent" : "Parental consent needed",
    bodyHtml: `<p>Hi ${escapeHtml(args.parentName)},</p>
      <p>${escapeHtml(args.applicantName)} has applied to Tee's House's mentorship program. Because they're under 18, we need your consent before we can pair them with a mentor.</p>
      <p>Please click below to review the program's safeguards and ${escapeHtml(verb)} their participation.</p>`,
    bodyText: `Hi ${args.parentName},\n\n${args.applicantName} has applied to Tee's House's mentorship program. Because they're under 18, we need your consent before we can pair them with a mentor.\n\nPlease visit the link below to review the program's safeguards and ${verb} their participation.`,
    cta: { label: args.isRenewal ? "Renew Consent" : "Review & Give Consent", href: args.consentUrl },
  }
}

export function parentConsentConfirmed(args: { parentName: string; applicantName: string }): EmailContent {
  return {
    subject: `Consent confirmed for ${args.applicantName}`,
    heading: "Thank you — consent confirmed",
    bodyHtml: `<p>Hi ${escapeHtml(args.parentName)},</p>
      <p>Thanks for confirming your consent for ${escapeHtml(args.applicantName)}'s participation in Tee's House's mentorship program. Our team will follow up as we match mentors within the current cohort.</p>`,
    bodyText: `Hi ${args.parentName},\n\nThanks for confirming your consent for ${args.applicantName}'s participation in Tee's House's mentorship program. Our team will follow up as we match mentors within the current cohort.`,
  }
}

export function applicantConfirmation(args: { firstName: string }): EmailContent {
  return {
    subject: "We received your mentorship application",
    heading: "Application received",
    bodyHtml: `<p>Hi ${escapeHtml(args.firstName)},</p>
      <p>Thanks for applying to Tee's House's mentorship program. Our team will review your application and follow up soon.</p>`,
    bodyText: `Hi ${args.firstName},\n\nThanks for applying to Tee's House's mentorship program. Our team will review your application and follow up soon.`,
  }
}

export function portalInvite(args: { firstName: string; inviteActionLink: string }): EmailContent {
  return {
    subject: "Set up your Tee's House mentorship portal account",
    heading: "You're approved — set up your account",
    bodyHtml: `<p>Hi ${escapeHtml(args.firstName)},</p>
      <p>You've been approved for Tee's House's mentorship program. Click below to set your password and access your mentorship portal.</p>
      <p>This link is one-time use and expires soon — set your password shortly after receiving this email.</p>`,
    bodyText: `Hi ${args.firstName},\n\nYou've been approved for Tee's House's mentorship program. Use the link below to set your password and access your mentorship portal.\n\nThis link is one-time use and expires soon.`,
    cta: { label: "Set Your Password", href: args.inviteActionLink },
  }
}

export function sessionCheckinPulse(args: {
  recipientName: string
  role: "mentor" | "mentee"
  ratingLinks: { rating: number; url: string }[]
}): EmailContent {
  const stars = args.ratingLinks
    .map(r => `<a href="${escapeHtml(r.url)}" style="display:inline-block;margin:0 4px;padding:10px 16px;border-radius:6px;background:${BRAND.amber};color:#fff;text-decoration:none;font-weight:600;">${r.rating}</a>`)
    .join("")
  return {
    subject: "Quick check-in: how's mentorship going?",
    heading: "How's it going so far?",
    bodyHtml: `<p>Hi ${escapeHtml(args.recipientName)},</p>
      <p>You're about a month into your mentorship pairing. On a scale of 1–5, how would you rate it so far? One click is all we need.</p>
      <div style="text-align:center;margin:20px 0;">${stars}</div>
      <p style="font-size:13px;color:${BRAND.grayMuted};">1 = not going well, 5 = going great</p>`,
    bodyText: `Hi ${args.recipientName},\n\nYou're about a month into your mentorship pairing. Rate it 1-5 using one of these links:\n\n${args.ratingLinks.map(r => `${r.rating}: ${r.url}`).join("\n")}`,
  }
}

export function mentorWeeklyNudge(args: {
  mentorName: string
  pairSummaries: { menteeName: string; status: string; daysSinceLastSession: number | null }[]
}): EmailContent {
  const rows = args.pairSummaries
    .map(p => `<li>${escapeHtml(p.menteeName)} — ${escapeHtml(p.status)}${p.daysSinceLastSession !== null ? ` (last session ${p.daysSinceLastSession}d ago)` : " (no sessions logged yet)"}</li>`)
    .join("")
  return {
    subject: "Your weekly mentorship check-in",
    heading: "Your mentees this week",
    bodyHtml: `<p>Hi ${escapeHtml(args.mentorName)},</p>
      <p>Here's where things stand with your mentee(s):</p>
      <ul style="padding-left:20px;">${rows}</ul>
      <p>Log in to your portal to record a session or update goals.</p>`,
    bodyText: `Hi ${args.mentorName},\n\nHere's where things stand with your mentee(s):\n\n${args.pairSummaries.map(p => `- ${p.menteeName}: ${p.status}${p.daysSinceLastSession !== null ? ` (last session ${p.daysSinceLastSession}d ago)` : " (no sessions logged yet)"}`).join("\n")}`,
    cta: { label: "Open Portal", href: `${SITE_URL}/mentorship/portal` },
  }
}

export function leadershipCohortDigest(args: {
  cohortName: string
  totalPairs: number
  activePairs: number
  needsAttention: { menteeName: string; mentorName: string; daysSinceLastSession: number }[]
}): EmailContent {
  const rows = args.needsAttention
    .map(p => `<li>${escapeHtml(p.mentorName)} / ${escapeHtml(p.menteeName)} — ${p.daysSinceLastSession} days since last session</li>`)
    .join("")
  return {
    subject: `Weekly mentorship digest: ${args.cohortName}`,
    heading: `${args.cohortName} — weekly digest`,
    bodyHtml: `<p>${args.activePairs} of ${args.totalPairs} pairs are active this week.</p>
      ${args.needsAttention.length ? `<p><strong>Needs attention (21+ days inactive):</strong></p><ul style="padding-left:20px;">${rows}</ul>` : "<p>No pairs currently flagged as inactive.</p>"}`,
    bodyText: `${args.activePairs} of ${args.totalPairs} pairs are active this week.\n\n${args.needsAttention.length ? `Needs attention (21+ days inactive):\n${args.needsAttention.map(p => `- ${p.mentorName} / ${p.menteeName}: ${p.daysSinceLastSession} days`).join("\n")}` : "No pairs currently flagged as inactive."}`,
    cta: { label: "Open Admin Dashboard", href: `${SITE_URL}/mentorship/admin` },
  }
}

export function certificateReady(args: { recipientName: string; certificateUrl: string }): EmailContent {
  return {
    subject: "Your mentorship certificate is ready",
    heading: "Congratulations!",
    bodyHtml: `<p>Hi ${escapeHtml(args.recipientName)},</p>
      <p>You've completed the Tee's House mentorship program. Your certificate is ready to view and print.</p>`,
    bodyText: `Hi ${args.recipientName},\n\nYou've completed the Tee's House mentorship program. Your certificate is ready to view and print.`,
    cta: { label: "View Certificate", href: args.certificateUrl },
  }
}

export function broadcastMessage(args: { heading: string; bodyHtml: string; bodyText: string }): EmailContent {
  return {
    subject: args.heading,
    heading: args.heading,
    bodyHtml: args.bodyHtml,
    bodyText: args.bodyText,
  }
}

export function consentExpiringSoon(args: {
  parentName: string
  applicantName: string
  renewUrl: string
}): EmailContent {
  return {
    subject: `Action needed: renew consent for ${args.applicantName}`,
    heading: "Your consent is about to expire",
    bodyHtml: `<p>Hi ${escapeHtml(args.parentName)},</p>
      <p>Your consent for ${escapeHtml(args.applicantName)}'s participation in Tee's House's mentorship program expires soon. Please renew it to keep their mentorship active.</p>`,
    bodyText: `Hi ${args.parentName},\n\nYour consent for ${args.applicantName}'s participation in Tee's House's mentorship program expires soon. Please renew it to keep their mentorship active.`,
    cta: { label: "Renew Consent", href: args.renewUrl },
  }
}
