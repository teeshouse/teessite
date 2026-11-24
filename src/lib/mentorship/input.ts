// Small validators for text that portal users type in. Everything the portal
// stores is shown to another person later, so it is trimmed, length-limited,
// and links are limited to http(s) (a `javascript:` link would run script
// when the other person clicks it).

export function cleanText(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : ""
}

/** Empty input gives null; a valid http(s) URL gives the URL; anything else gives undefined (invalid). */
export function cleanHttpUrl(v: unknown, max = 2000): string | null | undefined {
  if (v === undefined || v === null || v === "") return null
  if (typeof v !== "string" || v.length > max) return undefined
  try {
    const u = new URL(v.trim())
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : undefined
  } catch {
    return undefined
  }
}

/** Accepts only a real calendar date written YYYY-MM-DD. */
export function cleanDate(v: unknown): string | null {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null
  const d = new Date(`${v}T12:00:00Z`)
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v ? null : v
}

export function cleanInt(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v
  return typeof n === "number" && Number.isInteger(n) && n >= min && n <= max ? n : null
}

export function cleanList(v: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) return []
  return v
    .filter((x): x is string => typeof x === "string")
    .map(x => x.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxItems)
}
