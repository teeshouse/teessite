import { createBrowserClient } from "@supabase/ssr"

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser-side Supabase client for the admin/portal login forms. Uses
 * @supabase/ssr's cookie-backed storage (not localStorage, unlike the plain
 * `supabase` client in lib/supabase.ts) so the session is visible to
 * requireAdmin()/requirePortalUser() on the next server request.
 *
 * flowType: "implicit" — @supabase/ssr defaults to PKCE, which expects a
 * `?code=` query param. But admin.generateLink() (used for portal invites
 * and password recovery) always produces the older hash-fragment style
 * link (`#access_token=...`), not a PKCE code — with the default flowType,
 * detectSessionInUrl silently finds nothing and set-password shows "invalid
 * or expired" even on a fresh, never-used link. Implicit flow correctly
 * parses that hash. This doesn't affect plain signInWithPassword() calls
 * (AdminLoginForm/PortalLoginForm), which don't involve any URL flow.
 */
export function createBrowserSupabase() {
  return createBrowserClient(url, anon, {
    auth: { flowType: "implicit" },
  })
}
