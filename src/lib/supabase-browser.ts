import { createBrowserClient } from "@supabase/ssr"

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser-side Supabase client for the admin/portal login forms. Uses
 * @supabase/ssr's cookie-backed storage (not localStorage, unlike the plain
 * `supabase` client in lib/supabase.ts) so the session is visible to
 * middleware.ts and server components — signing in here is what makes
 * requireAdmin()/requirePortalUser() see the user on the next request.
 */
export function createBrowserSupabase() {
  return createBrowserClient(url, anon)
}
