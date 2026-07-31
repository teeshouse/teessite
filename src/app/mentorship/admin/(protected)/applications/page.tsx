import { supabaseAdmin } from "@/lib/supabase"
import ApplicationsTable from "@/components/mentorship/admin/ApplicationsTable"
import type { MentorshipApplication } from "@/lib/mentorship/types"

export const revalidate = 0
export const metadata = { title: "Applications | Mentorship Admin" }

export default async function AdminApplicationsPage() {
  const { data } = await supabaseAdmin
    .from("mentorship_applications")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-green-dark mb-6">Mentee Applications</h1>
      <ApplicationsTable applications={(data as MentorshipApplication[]) || []} />
    </div>
  )
}
