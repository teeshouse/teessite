import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Cookie-backed Supabase client for use in Server Components and Route
 * Handlers — reads the logged-in user's session via cookies, respects RLS
 * as that user. There's no middleware.ts refreshing the session cookie on
 * every request (deliberately removed — it required a Supabase client in
 * Vercel's Edge runtime, which kept crashing with
 * MIDDLEWARE_INVOCATION_FAILED); requireAdmin()/requirePortalUser() in
 * auth-guard.ts are the sole enforcement point, and sessions simply expire
 * and require re-login rather than silently refreshing.
 */
export function createServerSupabase() {
  const cookieStore = cookies()
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component that can't set cookies — safe to
          // ignore, middleware.ts already refreshes the session cookie.
        }
      },
    },
  })
}
