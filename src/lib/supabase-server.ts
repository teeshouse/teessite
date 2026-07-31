import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Cookie-backed Supabase client for use in Server Components and Route
 * Handlers — reads/refreshes the logged-in user's session via cookies
 * (set by middleware.ts), respects RLS as that user.
 *
 * Deliberately kept in its own file, separate from createMiddlewareSupabase
 * (see supabase-middleware.ts): next/headers's cookies() is not supported
 * inside Edge Middleware, and merely importing a module that references it
 * is enough to crash middleware at runtime (MIDDLEWARE_INVOCATION_FAILED)
 * even if the importing code never calls it.
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
