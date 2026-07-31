import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client for use inside middleware.ts, where req/res carry the
 * cookies directly — no next/headers dependency, so this is safe to import
 * from Edge Middleware (see supabase-server.ts for why that split matters).
 */
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
