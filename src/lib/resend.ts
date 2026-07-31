import { Resend } from "resend"

/**
 * Lazily-initialized Resend client.
 *
 * We DO NOT eagerly construct `new Resend(process.env.RESEND_API_KEY)` at
 * module load, because:
 *   1) During Next.js build-time the env var may be absent, which throws.
 *   2) Callers should explicitly opt in via isResendEnabled() so routes can
 *      fall back to "persist-only" behaviour until the domain migration and
 *      RESEND_API_KEY are live.
 */
let _client: Resend | null = null

export function isResendEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export function getResend(): Resend | null {
  if (!isResendEnabled()) return null
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY)
  return _client
}

// FROM domain must be verified in Resend. We verify teeshousepensacola.org
// because that's the domain we currently control DNS for. Once we gain
// DNS access to teeshouse.org, this can be swapped to mail.teeshouse.org.
export const FROM   = "Tee’s House <noreply@teeshousepensacola.org>"
// NOTIFY is the destination mailbox — Resend sends to any valid address,
// it does NOT need to match the FROM domain.
export const NOTIFY = "info@teeshouse.org"

// Brand palette (kept in sync with tailwind.config.ts)
export const BRAND = {
  greenDark:  "#2D5016",
  greenMid:   "#4A7C2F",
  greenLight: "#EAF2E3",
  amber:      "#C8860A",
  amberLight: "#FDF3DC",
  grayBody:   "#444444",
  grayMuted:  "#6B7280",
  grayBorder: "#E5E7EB",
  cream:      "#FBF6EF",
} as const

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Shared branded shell (header/footer chrome) used by both notifyInfo and
 * sendUserEmail, so the two email paths look like they came from the same
 * place instead of duplicating the header/footer markup.
 */
function renderShell(args: { title: string; headerSubtitle: string; bodyHtml: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(args.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.greenLight};font-family:Inter,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND.greenLight};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(45,80,22,0.08);">
        <!-- Header -->
        <tr><td style="background:${BRAND.greenDark};padding:28px 28px 24px;">
          <div style="font-family:Lora,Georgia,serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">Tee&rsquo;s House Inc.</div>
          <div style="font-size:12px;color:${BRAND.greenLight};margin-top:4px;letter-spacing:0.04em;">${escapeHtml(args.headerSubtitle)}</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:28px;">
          ${args.bodyHtml}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:${BRAND.cream};padding:18px 28px;border-top:1px solid ${BRAND.grayBorder};">
          <p style="margin:0;font-size:11px;color:${BRAND.grayMuted};line-height:1.5;">
            Tee&rsquo;s House Inc. &middot; Pensacola, FL &middot; 501(c)(3)
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/** A single key/value row to render in the email body. */
export interface Field {
  label: string
  value: string
}

export interface NotifyArgs {
  subject:  string
  /** Short intro line shown above the field table. */
  intro?:   string
  /** Structured rows rendered as a branded table. */
  fields?:  Field[]
  /**
   * A multi-line free-text block (e.g. the message body) rendered below
   * the fields. Line breaks are preserved.
   */
  body?:    string
  /**
   * Legacy plain-text fallback. If provided and `fields`/`body` are not,
   * it is rendered as-is in the text and HTML versions.
   */
  text?:    string
  replyTo?: string
}

/** Build the branded HTML body. Table-based layout for Gmail compatibility. */
function renderHtml(args: NotifyArgs): string {
  const intro  = args.intro  ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:${BRAND.grayBody};">${escapeHtml(args.intro)}</p>` : ""

  const rows = (args.fields || []).map(f => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.grayBorder};font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.greenMid};width:140px;vertical-align:top;">${escapeHtml(f.label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.grayBorder};font-size:14px;color:${BRAND.grayBody};vertical-align:top;">${escapeHtml(f.value || "—")}</td>
    </tr>`).join("")

  const fieldsTable = rows
    ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#ffffff;border:1px solid ${BRAND.grayBorder};border-radius:8px;overflow:hidden;margin:0 0 20px;">${rows}</table>`
    : ""

  const bodyBlock = args.body
    ? `<div style="background:${BRAND.cream};border-left:4px solid ${BRAND.amber};padding:16px 18px;border-radius:0 8px 8px 0;margin:0 0 24px;">
         <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND.greenMid};margin:0 0 8px;">Message</div>
         <div style="font-size:14px;line-height:1.6;color:${BRAND.grayBody};white-space:pre-wrap;">${escapeHtml(args.body)}</div>
       </div>`
    : ""

  const legacy = !rows && !args.body && args.text
    ? `<pre style="font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.6;color:${BRAND.grayBody};white-space:pre-wrap;margin:0 0 24px;">${escapeHtml(args.text)}</pre>`
    : ""

  const replyCta = args.replyTo
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 0;">
         <tr><td style="border-radius:8px;background:${BRAND.amber};">
           <a href="mailto:${escapeHtml(args.replyTo)}" style="display:inline-block;padding:12px 24px;font-family:Inter,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Reply to sender</a>
         </td></tr>
       </table>
       <p style="margin:12px 0 0;text-align:center;font-size:12px;color:${BRAND.grayMuted};">Or just hit Reply — it will go to ${escapeHtml(args.replyTo)}</p>`
    : ""

  const bodyHtml = `<h1 style="margin:0 0 16px;font-family:Lora,Georgia,serif;font-size:20px;line-height:1.3;color:${BRAND.greenDark};">${escapeHtml(args.subject)}</h1>
          ${intro}
          ${fieldsTable}
          ${bodyBlock}
          ${legacy}
          ${replyCta}`

  return renderShell({
    title: args.subject,
    headerSubtitle: "New submission from teeshousepensacola.org",
    bodyHtml,
  })
}

/** Build the plain-text fallback body. */
function renderText(args: NotifyArgs): string {
  if (args.text && !args.fields && !args.body) return args.text
  const parts: string[] = []
  if (args.intro) parts.push(args.intro, "")
  if (args.fields && args.fields.length) {
    const width = Math.max(...args.fields.map(f => f.label.length))
    for (const f of args.fields) {
      parts.push(`${f.label.padEnd(width)}  ${f.value || "-"}`)
    }
    parts.push("")
  }
  if (args.body) {
    parts.push("Message:", args.body, "")
  }
  if (args.replyTo) {
    parts.push(`Reply to: ${args.replyTo}`)
  }
  return parts.join("\n")
}

/**
 * Best-effort email notification to the org inbox (NOTIFY). Never throws:
 * if Resend is disabled or the API call fails, we log and return false so
 * the caller can still succeed with the persisted DB row.
 */
export async function notifyInfo(args: NotifyArgs): Promise<boolean> {
  const client = getResend()
  if (!client) return false
  try {
    const res = await client.emails.send({
      from:    FROM,
      to:      NOTIFY,
      subject: args.subject,
      text:    renderText(args),
      html:    renderHtml(args),
      replyTo: args.replyTo,
    })
    if (res.error) {
      console.error("Resend send error:", res.error)
      return false
    }
    return true
  } catch (err) {
    console.error("Resend threw:", err)
    return false
  }
}

export interface UserEmailArgs {
  to: string
  subject: string
  /** Large heading inside the card, e.g. "Confirm your consent". */
  heading: string
  bodyHtml: string
  bodyText: string
  cta?: { label: string; href: string }
  replyTo?: string
}

/**
 * Best-effort email sent TO an end user (parent, mentor, mentee) rather than
 * the fixed org inbox — used for consent requests, portal invites, session
 * reminders, certificates, nudges/digests. Same lazy-client/never-throw
 * contract as notifyInfo.
 */
export async function sendUserEmail(args: UserEmailArgs): Promise<boolean> {
  const client = getResend()
  if (!client) return false

  const ctaHtml = args.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;">
         <tr><td style="border-radius:8px;background:${BRAND.greenDark};">
           <a href="${escapeHtml(args.cta.href)}" style="display:inline-block;padding:14px 28px;font-family:Inter,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(args.cta.label)}</a>
         </td></tr>
       </table>`
    : ""

  const bodyHtml = `<h1 style="margin:0 0 16px;font-family:Lora,Georgia,serif;font-size:20px;line-height:1.3;color:${BRAND.greenDark};">${escapeHtml(args.heading)}</h1>
    <div style="font-size:15px;line-height:1.6;color:${BRAND.grayBody};">${args.bodyHtml}</div>
    ${ctaHtml}`

  const html = renderShell({
    title: args.subject,
    headerSubtitle: "Mentorship Program",
    bodyHtml,
  })

  const ctaText = args.cta ? `\n${args.cta.label}: ${args.cta.href}\n` : ""
  const text = `${args.bodyText}${ctaText}`

  try {
    const res = await client.emails.send({
      from:    FROM,
      to:      args.to,
      subject: args.subject,
      text,
      html,
      replyTo: args.replyTo,
    })
    if (res.error) {
      console.error("Resend send error (sendUserEmail):", res.error)
      return false
    }
    return true
  } catch (err) {
    console.error("Resend threw (sendUserEmail):", err)
    return false
  }
}
