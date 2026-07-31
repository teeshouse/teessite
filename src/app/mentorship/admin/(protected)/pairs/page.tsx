import { supabaseAdmin } from "@/lib/supabase"
import PairsPanel from "@/components/mentorship/admin/PairsPanel"

export const revalidate = 0
export const metadata = { title: "Pairs | Mentorship Admin" }

export default async function AdminPairsPage() {
  const [{ data: pairs }, { data: mentors }, { data: mentees }, { data: cohorts }] = await Promise.all([
    supabaseAdmin
      .from("mentorship_pairs")
      .select(`id, status, flagged, certificate_token, mentor:mentors(id, first_name, last_name), mentee:mentorship_applications(id, first_name, last_name, is_minor)`)
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("mentors").select("id, first_name, last_name").in("status", ["approved", "active"]),
    supabaseAdmin.from("mentorship_applications").select("id, first_name, last_name, is_minor, parent_consent").in("status", ["pending", "reviewing"]),
    supabaseAdmin.from("mentorship_cohorts").select("id, name").order("year", { ascending: false }),
  ])

  return (
    <div>
      <h1 className="text-green-dark mb-6">Pairs</h1>
      <PairsPanel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pairs={(pairs as any) || []}
        mentors={mentors || []}
        mentees={mentees || []}
        cohorts={cohorts || []}
      />
    </div>
  )
}
