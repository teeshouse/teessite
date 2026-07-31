import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { supabaseAdmin } from "@/lib/supabase"
import GoalsPanel from "@/components/mentorship/portal/GoalsPanel"
import type { MentorshipGoal } from "@/lib/mentorship/types"

export const revalidate = 0
export const metadata = { title: "Goals | Mentorship Portal" }

export default async function PortalGoalsPage() {
  const { user } = await requirePortalUser()
  if (!user) return null
  const pair = await getPairForPortalUser(user.role, user.profileId)

  let goals: MentorshipGoal[] = []
  if (pair) {
    const { data } = await supabaseAdmin.from("mentorship_goals").select("*").eq("pair_id", pair.id).order("created_at", { ascending: false })
    goals = (data as MentorshipGoal[]) || []
  }

  return (
    <div>
      <h1 className="text-green-dark mb-6">Goals</h1>
      {!pair ? <p className="text-gray-muted text-sm">No active pairing yet.</p> : <GoalsPanel goals={goals} />}
    </div>
  )
}
