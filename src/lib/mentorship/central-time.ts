// Tee's House is in Pensacola, so every date and time in the mentorship
// portal is Central Time (America/Chicago, which includes daylight saving).
export const CENTRAL_TZ = "America/Chicago"

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const LOCAL_DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/

const pad = (n: number) => String(n).padStart(2, "0")

/** Offset of Central Time from UTC, in minutes, at a given instant (negative: behind UTC). */
function centralOffsetMinutes(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TZ, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs))
  const get = (t: string) => Number(parts.find(p => p.type === t)!.value)
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"))
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60_000)
}

/**
 * Turns what a browser <input type="datetime-local"> gives ("2026-12-01T10:00")
 * into an ISO timestamp that carries Central Time's offset
 * ("2026-12-01T10:00:00-06:00"). Returns null if the value is not in that format.
 * The offset is kept in the string so that even a date-only column still
 * records the correct Central calendar day.
 */
export function centralLocalToISO(local: unknown): string | null {
  if (typeof local !== "string") return null
  const m = LOCAL_DATETIME.exec(local)
  if (!m) return null
  const [y, mo, d, h, mi] = m.slice(1).map(Number)
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null

  const localAsUtc = Date.UTC(y, mo - 1, d, h, mi)
  let instant = localAsUtc - centralOffsetMinutes(localAsUtc) * 60_000
  instant = localAsUtc - centralOffsetMinutes(instant) * 60_000
  const offset = centralOffsetMinutes(instant)
  const sign = offset < 0 ? "-" : "+"
  const abs = Math.abs(offset)
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}

/**
 * Formats a stored value as a Central Time date. A date-only value
 * ("2026-11-24") is a calendar day, not a moment, so it is shown as-is
 * instead of being shifted by the viewer's timezone.
 */
export function formatCentralDate(value: string | null | undefined, opts: { long?: boolean } = {}): string {
  if (!value) return "—"
  const style: Intl.DateTimeFormatOptions = { year: "numeric", month: opts.long ? "long" : "short", day: "numeric" }
  if (DATE_ONLY.test(value)) {
    return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", { ...style, timeZone: "UTC" })
  }
  return new Date(value).toLocaleDateString("en-US", { ...style, timeZone: CENTRAL_TZ })
}

/** Formats a stored value as a Central Time date and time; date-only values show just the day. */
export function formatCentralDateTime(value: string | null | undefined): string {
  if (!value) return "—"
  if (DATE_ONLY.test(value)) return formatCentralDate(value)
  return new Date(value).toLocaleString("en-US", {
    timeZone: CENTRAL_TZ, year: "numeric", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short",
  })
}
