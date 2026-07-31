import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { supabaseAdmin } from "@/lib/supabase"
import ResourcesPanel from "@/components/mentorship/portal/ResourcesPanel"
import type { MentorshipResource } from "@/lib/mentorship/types"

export const revalidate = 0
export const metadata = { title: "Resources | Mentorship Portal" }

export default async function PortalResourcesPage() {
  const { user } = await requirePortalUser()
  if (!user) return null
  const pair = await getPairForPortalUser(user.role, user.profileId)

  let resources: MentorshipResource[] = []
  if (pair) {
    const { data } = await supabaseAdmin.from("mentorship_resources").select("*").eq("pair_id", pair.id).order("created_at", { ascending: false })
    resources = (data as MentorshipResource[]) || []
  }

  return (
    <div>
      <h1 className="text-green-dark mb-6">Resources</h1>
      {!pair ? <p className="text-gray-muted text-sm">No active pairing yet.</p> : <ResourcesPanel resources={resources} />}
    </div>
  )
}
