import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { supabaseAdmin } from "@/lib/supabase"
import SchedulePanel from "@/components/mentorship/portal/SchedulePanel"
import type { MentorshipScheduledSession } from "@/lib/mentorship/types"

export const revalidate = 0
export const metadata = { title: "Schedule | Mentorship Portal" }

export default async function PortalSchedulePage() {
  const { user } = await requirePortalUser()
  if (!user) return null
  const pair = await getPairForPortalUser(user.role, user.profileId)

  let scheduledSessions: MentorshipScheduledSession[] = []
  if (pair) {
    const { data } = await supabaseAdmin
      .from("mentorship_scheduled_sessions")
      .select("*")
      .eq("pair_id", pair.id)
      .order("scheduled_date", { ascending: true })
    scheduledSessions = (data as MentorshipScheduledSession[]) || []
  }

  return (
    <div>
      <h1 className="text-green-dark mb-6">Schedule</h1>
      {!pair ? <p className="text-gray-muted text-sm">No active pairing yet.</p> : <SchedulePanel scheduledSessions={scheduledSessions} />}
    </div>
  )
}
