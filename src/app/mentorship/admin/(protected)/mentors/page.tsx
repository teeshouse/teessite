import { supabaseAdmin } from "@/lib/supabase"
import MentorsTable from "@/components/mentorship/admin/MentorsTable"
import type { Mentor } from "@/lib/mentorship/types"

export const revalidate = 0
export const metadata = { title: "Mentors | Mentorship Admin" }

export default async function AdminMentorsPage() {
  const { data } = await supabaseAdmin
    .from("mentors")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-green-dark mb-6">Mentors</h1>
      <MentorsTable mentors={(data as Mentor[]) || []} />
    </div>
  )
}
