export const SESSION_COOKIE = "mentorship_session"

// Matches Supabase's default access-token lifetime (1hr). No refresh here —
// sessions simply expire and require re-login, a deliberate tradeoff after
// dropping middleware.ts (see git history on that file).
export const SESSION_COOKIE_MAX_AGE = 60 * 60
