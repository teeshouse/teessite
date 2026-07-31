import { supabaseAdmin } from "@/lib/supabase"
import CohortsPanel from "@/components/mentorship/admin/CohortsPanel"
import type { MentorshipCohort } from "@/lib/mentorship/types"

export const revalidate = 0
export const metadata = { title: "Cohorts | Mentorship Admin" }

export default async function AdminCohortsPage() {
  const { data } = await supabaseAdmin.from("mentorship_cohorts").select("*").order("year", { ascending: false })

  return (
    <div>
      <h1 className="text-green-dark mb-6">Cohorts</h1>
      <CohortsPanel cohorts={(data as MentorshipCohort[]) || []} />
    </div>
  )
}
