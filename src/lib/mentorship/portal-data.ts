import { supabaseAdmin } from "@/lib/supabase"

/**
 * Finds the pair a portal user should see: their newest ACTIVE pair, or the
 * most recent one if none is active (e.g. a completed pair, so alumni can
 * still open their history). A newer finished pair never hides an active one.
 */
export async function getPairForPortalUser(role: "mentor" | "mentee", profileId: string) {
  const column = role === "mentor" ? "mentor_id" : "mentee_id"
  const { data } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`*, mentor:mentors(id, first_name, last_name, email), mentee:mentorship_applications(id, first_name, last_name, email)`)
    .eq(column, profileId)
    .order("created_at", { ascending: false })
  return data?.find(p => p.status === "active") ?? data?.[0] ?? null
}
