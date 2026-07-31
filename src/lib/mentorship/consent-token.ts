import crypto from "crypto"

/** Token emailed to a minor applicant's parent/guardian; the consent page looks up by this. */
export function generateParentToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export const PARENT_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000 // 14 days
export const CONSENT_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000 // 1 year, then re-consent required

export function parentTokenExpiresAt(): string {
  return new Date(Date.now() + PARENT_TOKEN_TTL_MS).toISOString()
}

export function consentExpiresAt(): string {
  return new Date(Date.now() + CONSENT_VALIDITY_MS).toISOString()
}

/** Server-side age computation — never trust a client-sent is_minor flag. */
export function isMinor(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return true // unparseable DOB — fail safe toward requiring consent
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDiff = now.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--
  }
  return age < 18
}
