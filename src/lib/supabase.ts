import { createClient, type SupabaseClient, type SupabaseClientOptions } from "@supabase/supabase-js"

/**
 * Lazily-constructed Supabase clients. We do NOT call createClient() at
 * module load time, because Next.js's build-time "collecting page data"
 * step imports every route module to inspect its config — that would run
 * this immediately and throw if the env var isn't present in that exact
 * build context, failing the whole build (this bit us: mentorship routes
 * were the first to import supabaseAdmin from here at module scope; prior
 * routes each built their own client inline, inside the handler body,
 * which is never evaluated at build time).
 *
 * The Proxy defers actual construction to the first real method call
 * (e.g. `.from(...)`), which only happens once a request handler actually
 * runs — so every existing call site (`supabaseAdmin.from(...)`) keeps
 * working unchanged.
 */
function lazyClient<T extends Record<string, unknown>>(
  getUrl: () => string,
  getKey: () => string,
  options?: SupabaseClientOptions<"public">
): SupabaseClient {
  let client: SupabaseClient | null = null
  function resolve(): SupabaseClient {
    if (!client) client = createClient(getUrl(), getKey(), options)
    return client
  }
  return new Proxy({} as T, {
    get(_target, prop) {
      const value = (resolve() as unknown as Record<string | symbol, unknown>)[prop]
      return typeof value === "function" ? value.bind(resolve()) : value
    },
  }) as unknown as SupabaseClient
}

// Public client (browser-safe, respects RLS)
export const supabase = lazyClient(
  () => process.env.NEXT_PUBLIC_SUPABASE_URL!,
  () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Service client (server-only, bypasses RLS)
export const supabaseAdmin = lazyClient(
  () => process.env.NEXT_PUBLIC_SUPABASE_URL!,
  () => process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
