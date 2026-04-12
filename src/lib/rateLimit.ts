/**
 * Tiny in-memory rate limiter + honeypot helper for API routes.
 *
 * This is intentionally simple — we do NOT want Redis / Upstash for a
 * nonprofit contact form. An in-memory Map sitting on the Next.js server
 * is enough to stop dumb bots and accidental double-submits.
 *
 * Caveats:
 *   - Resets whenever the serverless instance recycles (fine; bots burst
 *     from single IPs within seconds, not hours).
 *   - Not shared across Vercel function instances (bots usually hammer
 *     one instance at a time; worst case a few extra submissions slip
 *     through — still a massive improvement over nothing).
 *   - Keyed by the best IP we can pull from request headers.
 */

import type { NextRequest } from "next/server"

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Best-effort IP extraction from a Next.js request. */
export function getClientIp(req: NextRequest): string {
  // Vercel / most proxies set x-forwarded-for as "client, proxy1, proxy2"
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  const real = req.headers.get("x-real-ip")
  if (real) return real.trim()
  return "unknown"
}

/**
 * Returns true if this key is allowed to proceed.
 * Returns false if the caller has exceeded `limit` calls within `windowMs`.
 *
 * Default: 5 requests per minute per IP+scope.
 */
export function checkRateLimit(
  key: string,
  opts: { limit?: number; windowMs?: number } = {}
): { ok: true } | { ok: false; retryAfterSec: number } {
  const limit    = opts.limit    ?? 5
  const windowMs = opts.windowMs ?? 60_000
  const now      = Date.now()

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) }
  }

  bucket.count += 1
  return { ok: true }
}

/**
 * Honeypot check. The client renders a hidden `<input name="website">`
 * styled off-screen. Real users never fill it. Bots that blindly fill
 * every field will, and we silently drop those submissions.
 *
 * Returns true if the submission looks like a bot (caller should bail).
 */
export function isHoneypotTripped(body: unknown): boolean {
  if (!body || typeof body !== "object") return false
  const website = (body as Record<string, unknown>).website
  return typeof website === "string" && website.trim().length > 0
}
