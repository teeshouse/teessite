import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Cookie-backed Supabase client for use in Server Components and Route
 * Handlers — reads/refreshes the logged-in user's session via cookies
 * (set by middleware.ts), respects RLS as that user.
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

/** Supabase client for use inside middleware.ts, where req/res carry the cookies. */
export function createMiddlewareSupabase(req: NextRequest, res: NextResponse) {
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        )
      },
    },
  })
}
