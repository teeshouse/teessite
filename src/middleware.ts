import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareSupabase } from "@/lib/supabase-middleware"

/**
 * Refreshes the Supabase session cookie and redirects unauthenticated
 * requests away from the admin/portal areas.
 *
 * This only checks "is there a valid session" — it deliberately does NOT
 * check admin_users/mentors/mentorship_applications membership (that would
 * mean a DB round-trip on every request). The authoritative role check
 * happens per-route via requireAdmin()/requirePortalUser()
 * (src/lib/mentorship/auth-guard.ts), called from layouts and API routes.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabase(req, res)

  const { data: { user } } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname
  const isAdminArea  = path.startsWith("/mentorship/admin") && !path.startsWith("/mentorship/admin/login")
  const isPortalArea = path.startsWith("/mentorship/portal") &&
    !path.startsWith("/mentorship/portal/login") &&
    !path.startsWith("/mentorship/portal/set-password")

  if (!user && isAdminArea) {
    return NextResponse.redirect(new URL("/mentorship/admin/login", req.url))
  }
  if (!user && isPortalArea) {
    return NextResponse.redirect(new URL("/mentorship/portal/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/mentorship/admin/:path*", "/mentorship/portal/:path*"],
}
