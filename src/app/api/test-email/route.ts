import { NextResponse } from "next/server"
import { getResend, isResendEnabled, FROM, NOTIFY } from "@/lib/resend"

/**
 * Debug endpoint: GET /api/test-email?secret=XYZ&to=optional@example.com
 *
 * Requires env var PING_SECRET (same one the /api/ping route uses).
 * Returns the raw Resend response or error so you can diagnose without
 * digging through Vercel function logs.
 *
 * Delete this route once email is confirmed working.
 */
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get("secret")
  const toOverride = url.searchParams.get("to")

  if (!process.env.PING_SECRET) {
    return NextResponse.json(
      { ok: false, stage: "config", error: "PING_SECRET env var not set" },
      { status: 503 },
    )
  }
  if (secret !== process.env.PING_SECRET) {
    return NextResponse.json({ ok: false, stage: "auth", error: "bad secret" }, { status: 401 })
  }

  const enabled = isResendEnabled()
  if (!enabled) {
    return NextResponse.json(
      {
        ok: false,
        stage: "env",
        error: "RESEND_API_KEY is not set in this deployment",
        hint: "Add it in Vercel Settings -> Environment Variables, then REDEPLOY.",
      },
      { status: 503 },
    )
  }

  const client = getResend()
  if (!client) {
    return NextResponse.json(
      { ok: false, stage: "client", error: "getResend() returned null" },
      { status: 500 },
    )
  }

  const to = toOverride || NOTIFY
  try {
    const res = await client.emails.send({
      from: FROM,
      to,
      subject: "Tee's House test email",
      text: `This is a diagnostic email from /api/test-email at ${new Date().toISOString()}.`,
    })
    if (res.error) {
      return NextResponse.json(
        { ok: false, stage: "send", from: FROM, to, error: res.error },
        { status: 502 },
      )
    }
    return NextResponse.json({ ok: true, from: FROM, to, id: res.data?.id ?? null })
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        stage: "throw",
        from: FROM,
        to,
        error: err instanceof Error ? { name: err.name, message: err.message } : String(err),
      },
      { status: 500 },
    )
  }
}
