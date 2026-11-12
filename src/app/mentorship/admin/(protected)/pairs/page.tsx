import { supabaseAdmin } from "@/lib/supabase"
import PairsPanel from "@/components/mentorship/admin/PairsPanel"

export const revalidate = 0
export const metadata = { title: "Pairs | Mentorship Admin" }

export default async function AdminPairsPage() {
  const [{ data: pairs }, { data: mentors }, { data: mentees }, { data: cohorts }] = await Promise.all([
    supabaseAdmin
      .from("mentorship_pairs")
      .select(`id, status, flagged, certificate_token, mentor:mentors(id, first_name, last_name), mentee:mentorship_applications(id, first_name, last_name, is_minor), cohort:mentorship_cohorts(name)`)
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("mentors").select("id, first_name, last_name").in("status", ["approved", "active"]),
    supabaseAdmin.from("mentorship_applications").select("id, first_name, last_name, is_minor, parent_consent, status").not("status", "in", "(declined,completed)").order("created_at", { ascending: false }),
    supabaseAdmin.from("mentorship_cohorts").select("id, name").order("year", { ascending: false }),
  ])

  // Anyone not declined/completed can be paired, unless they already have an active pair.
  const pairedInternIds = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((pairs as any[]) || []).filter(p => p.status === "active").map(p => p.mentee?.id)
  )
  const availableInterns = (mentees || []).filter(m => !pairedInternIds.has(m.id))

  return (
    <div>
      <h1 className="text-green-dark mb-6">Pairs</h1>
      <PairsPanel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pairs={(pairs as any) || []}
        mentors={mentors || []}
        mentees={availableInterns}
        cohorts={cohorts || []}
      />
    </div>
  )
}
