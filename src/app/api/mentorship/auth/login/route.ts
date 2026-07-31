import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit"
import { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/mentorship/session-cookie"

/**
 * Shared login endpoint for both the admin dashboard and the mentor/mentee
 * portal — it only verifies credentials and sets a session cookie holding
 * the raw access token. Which area the account can reach is determined
 * afterward by requireAdmin()/requirePortalUser() looking up admin_users /
 * mentors / mentorship_applications, not by this route.
 *
 * Deliberately NOT using @supabase/ssr here — see git history on
 * middleware.ts and supabase-server.ts for why: its cookie codec doesn't
 * reliably round-trip through Next.js's cookies() API in this deployment
 * (a known unresolved upstream issue). This route sets one plain cookie
 * holding the access token JWT, validated server-side via
 * supabaseAdmin.auth.getUser(token) — no codec, nothing to get wrong.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const ip = getClientIp(req)
    const gate = checkRateLimit(`mentorship-login:${ip}`, { limit: 8, windowMs: 5 * 60_000 })
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.session) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE, data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    })
    return res
  } catch (err) {
    console.error("Mentorship login error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
