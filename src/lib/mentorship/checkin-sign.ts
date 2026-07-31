import crypto from "crypto"

/**
 * HMAC-signed one-click links for the week-4 check-in pulse email (5 star-
 * rating links, one per rating value). Signature + expiry prevent tampering
 * and replay past the TTL — the token itself is the authorization, no login
 * required to click a rating link from an email.
 */

const SECRET = process.env.CHECKIN_SIGNING_SECRET || process.env.CRON_SECRET || ""
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface CheckinPayload {
  pairId: string
  role: "mentor" | "mentee"
  rating: number
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex")
}

export function signCheckinToken(payload: CheckinPayload): string {
  const exp = Date.now() + TTL_MS
  const data = `${payload.pairId}.${payload.role}.${payload.rating}.${exp}`
  const sig = sign(data)
  return Buffer.from(`${data}.${sig}`).toString("base64url")
}

export function verifyCheckinToken(
  token: string
): { valid: true; pairId: string; role: "mentor" | "mentee"; rating: number } | { valid: false } {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8")
    const [pairId, role, ratingStr, expStr, sig] = decoded.split(".")
    if (!pairId || !role || !ratingStr || !expStr || !sig) return { valid: false }

    const data = `${pairId}.${role}.${ratingStr}.${expStr}`
    const expectedSig = sign(data)
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return { valid: false }
    }

    if (Date.now() > Number(expStr)) return { valid: false }
    if (role !== "mentor" && role !== "mentee") return { valid: false }

    return { valid: true, pairId, role, rating: Number(ratingStr) }
  } catch {
    return { valid: false }
  }
}
