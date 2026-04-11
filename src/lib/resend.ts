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

// FROM domain must be verified in Resend (DNS records on whichever
// subdomain you verify — e.g. teeshouse.org or mail.teeshouse.org).
export const FROM   = "Tee’s House <noreply@mail.teeshouse.org>"
// NOTIFY is just the destination mailbox — no Resend verification needed
// for the receiving address, any valid inbox works.
export const NOTIFY = "info@mail.teeshouse.org"

export interface NotifyArgs {
  subject: string
  text:    string
  replyTo?: string
}

/**
 * Best-effort email notification. Never throws: if Resend is disabled or
 * the API call fails, we log and return false so the caller can still
 * succeed with the persisted DB row.
 */
export async function notifyInfo(args: NotifyArgs): Promise<boolean> {
  const client = getResend()
  if (!client) return false
  try {
    const res = await client.emails.send({
      from: FROM,
      to:   NOTIFY,
      subject: args.subject,
      text:    args.text,
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