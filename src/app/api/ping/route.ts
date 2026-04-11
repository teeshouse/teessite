import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Supabase keep-alive ping.
 *
 * Free-tier Supabase projects pause after 7 days with no activity. Hitting
 * this route from a weekly external scheduler (Vercel Cron, GitHub Actions,
 * cron-job.org, etc.) issues a cheap SELECT so the project stays warm.
 *
 * Guarded by PING_SECRET to prevent random GET spam from consuming budget.
 * Call with:
 *   GET /api/ping?secret=<PING_SECRET>
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const provided = url.searchParams.get("secret")
  const expected = process.env.PING_SECRET

  if (!expected) {
    return NextResponse.json({ error: "Ping not configured" }, { status: 503 })
  }
  if (provided !== expected) {
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
