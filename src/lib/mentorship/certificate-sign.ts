import crypto from "crypto"

/**
 * Generates the unguessable token stored on mentorship_pairs.certificate_token
 * and used as the sole lookup key for /mentorship/certificate/[token] — the
 * pair's actual UUID is never exposed in a certificate URL. No expiry (a
 * completion certificate should stay valid indefinitely); if a link ever
 * leaks, an admin can regenerate the token to invalidate the old one.
 */
export function generateCertificateToken(): string {
  return crypto.randomBytes(24).toString("hex")
}
