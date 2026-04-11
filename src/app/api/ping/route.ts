import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Supabase keep-alive ping.
 *
 * Free-tier Supabase projects pause after 7 days with no activity. Hitting
 * this route from a weekly scheduler issues a cheap count query so the
 * project stays warm.
 *
 * Auth: accepts EITHER of
 *   1) `?secret=<PING_SECRET>`    (works with any external cron)
 *   2) `Authorization: Bearer <CRON_SECRET>` header, which Vercel Cron
 *      attaches automatically when the CRON_SECRET env var is set.
 *
 * If neither secret env var is configured, the route returns 503 so a
 * misconfigured deployment is obvious instead of silently accepting traffic.
 *
 * The weekly schedule is defined in vercel.json.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const querySecret = url.searchParams.get("secret")
  const pingSecret  = process.env.PING_SECRET
  const cronSecret  = process.env.CRON_SECRET

  if (!pingSecret && !cronSecret) {
    return NextResponse.json({ error: "Ping not configured" }, { status: 503 })
  }

  const authHeader = req.headers.get("authorization") || ""
  const bearerOk   = cronSecret && authHeader === `Bearer ${cronSecret}`
  const querySecretOk = pingSecret && querySecret === pingSecret

  if (!bearerOk && !querySecretOk) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase env vars missing" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Cheapest possible query: count on a table we know exists.
  const { error, count } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })

  if (error) {
    console.error("Ping query failed:", JSON.stringify(error))
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    pingedAt: new Date().toISOString(),
    contactRows: count ?? null,
  })
}
