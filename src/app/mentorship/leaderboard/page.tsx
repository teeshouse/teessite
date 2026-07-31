import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { supabaseAdmin } from "@/lib/supabase"
import { Trophy } from "lucide-react"

export const revalidate = 60
export const metadata = { title: "Mentor Leaderboard | Tee's House" }

interface MentorAgg { id: string; name: string; sessions: number }

export default async function LeaderboardPage() {
  const { data: pairs } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`session_count, mentor:mentors(id, first_name, last_name)`)
    .in("status", ["active", "completed"])

  const byMentor = new Map<string, MentorAgg>()
  for (const pair of pairs || []) {
    const mentor = Array.isArray(pair.mentor) ? pair.mentor[0] : pair.mentor
    if (!mentor) continue
    const existing = byMentor.get(mentor.id) || { id: mentor.id, name: `${mentor.first_name} ${mentor.last_name}`, sessions: 0 }
    existing.sessions += pair.session_count || 0
    byMentor.set(mentor.id, existing)
  }
  const ranked = Array.from(byMentor.values()).filter(m => m.sessions > 0).sort((a, b) => b.sessions - a.sessions)

  return (
    <>
      <Navbar />
      <main>
        <section className="relative text-white py-20 px-4 overflow-hidden bg-green-dark">
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Mentorship Program</span>
            <h1 className="text-white mt-3 text-3xl md:text-4xl">Mentor Leaderboard</h1>
          </div>
        </section>
        <section className="section-padding bg-white">
          <div className="container-max max-w-2xl">
            {!ranked.length ? (
              <p className="text-gray-muted text-sm text-center">No sessions logged yet.</p>
            ) : (
              <div className="card overflow-hidden">
                {ranked.map((m, i) => (
                  <div key={m.id} className={`flex items-center justify-between p-4 ${i !== ranked.length - 1 ? "border-b border-gray-border" : ""}`}>
                    <div className="flex items-center gap-3">
                      {i < 3 ? <Trophy className="w-5 h-5 text-amber" /> : <span className="w-5 text-center text-gray-muted text-sm">{i + 1}</span>}
                      <span className="text-gray-body font-medium">{m.name}</span>
                    </div>
                    <span className="text-green-dark font-semibold text-sm">{m.sessions} sessions</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
