import { Resend } from "resend"
export const resend = new Resend(process.env.RESEND_API_KEY)
export const FROM   = "Tee's House <noreply@teeshouse.org>"
export const NOTIFY = "info@teeshouse.org"