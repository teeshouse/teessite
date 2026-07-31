import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { supabaseAdmin } from "@/lib/supabase"

export const revalidate = 60
export const metadata = { title: "Mentorship Alumni | Tee's House" }

// Minor mentees are shown as "First L." not a full name — a public page is
// not the place to publish a minor's full identity, even for a positive
// story. Adult mentees can be shown by full name.
function displayName(firstName: string, lastName: string, isMinor: boolean) {
  return isMinor ? `${firstName} ${lastName.charAt(0)}.` : `${firstName} ${lastName}`
}

export default async function AlumniPage() {
  const { data: pairs } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`
      id, ended_at,
      mentee:mentorship_applications(first_name, last_name, is_minor, areas_of_interest),
      cohort:mentorship_cohorts(name)
    `)
    .eq("status", "completed")
    .order("ended_at", { ascending: false })

  return (
    <>
      <Navbar />
      <main>
        <section className="relative text-white py-20 px-4 overflow-hidden bg-green-dark">
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Mentorship Program</span>
            <h1 className="text-white mt-3 text-3xl md:text-4xl">Program Alumni</h1>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max">
            {!pairs?.length ? (
              <p className="text-gray-muted text-sm text-center">No completed pairings yet — check back soon!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pairs.map(p => {
                  const mentee = Array.isArray(p.mentee) ? p.mentee[0] : p.mentee
                  const cohort = Array.isArray(p.cohort) ? p.cohort[0] : p.cohort
                  if (!mentee) return null
                  return (
                    <div key={p.id} className="card p-5">
                      <h3 className="text-green-dark font-semibold mb-1">
                        {displayName(mentee.first_name, mentee.last_name, mentee.is_minor)}
                      </h3>
                      {cohort?.name && <p className="text-xs text-amber uppercase tracking-wide mb-2">{cohort.name}</p>}
                      {!!mentee.areas_of_interest?.length && (
                        <div className="flex flex-wrap gap-1.5">
                          {mentee.areas_of_interest.slice(0, 3).map((i: string) => (
                            <span key={i} className="badge-current text-xs">{i}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            <div className="text-center mt-10">
              <Link href="/mentorship/apply-mentor" className="btn-amber">Become a Mentor</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
