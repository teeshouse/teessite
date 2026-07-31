import { supabaseAdmin } from "@/lib/supabase"

/** Finds the active (or most recently completed) pair for a portal user. */
export async function getPairForPortalUser(role: "mentor" | "mentee", profileId: string) {
  const column = role === "mentor" ? "mentor_id" : "mentee_id"
  const { data } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`*, mentor:mentors(id, first_name, last_name, email), mentee:mentorship_applications(id, first_name, last_name, email)`)
    .eq(column, profileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}
