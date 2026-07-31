import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { supabaseAdmin } from "@/lib/supabase"
import SessionsPanel from "@/components/mentorship/portal/SessionsPanel"
import type { MentorshipSession } from "@/lib/mentorship/types"

export const revalidate = 0
export const metadata = { title: "Sessions | Mentorship Portal" }

export default async function PortalSessionsPage() {
  const { user } = await requirePortalUser()
  if (!user) return null
  const pair = await getPairForPortalUser(user.role, user.profileId)

  let sessions: MentorshipSession[] = []
  if (pair) {
    const { data } = await supabaseAdmin
      .from("mentorship_sessions")
      .select("*")
      .eq("pair_id", pair.id)
      .order("session_date", { ascending: false })
    sessions = (data as MentorshipSession[]) || []
  }

  return (
    <div>
      <h1 className="text-green-dark mb-6">Sessions</h1>
      {!pair ? <p className="text-gray-muted text-sm">No active pairing yet.</p> : <SessionsPanel sessions={sessions} />}
    </div>
  )
}
