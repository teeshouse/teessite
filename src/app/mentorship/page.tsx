import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Users, HandHeart, Sprout, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Mentorship Program | Tee's House",
  description: "Tee's House's mentorship program pairs Pensacola youth with caring adult mentors for guided growth in agriculture, arts, and life skills.",
}

export default function MentorshipPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative text-white py-28 px-4 overflow-hidden bg-green-dark">
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Growing Together</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Mentorship Program</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto">
              We pair Pensacola youth with caring adult mentors for guided growth through
              agriculture, arts, and life skills — one season, and one relationship, at a time.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-10">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">How It Works</span>
              <h2 className="text-green-dark mt-3">A Season-Long Partnership</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, title: "Apply", desc: "Youth and mentors each submit an application. Parental consent is required for anyone under 18." },
                { icon: ShieldCheck, title: "Review", desc: "Our team reviews every application and confirms all required safeguards are in place." },
                { icon: HandHeart, title: "Pair Up", desc: "We match mentors and mentees within a cohort based on interests and goals." },
                { icon: Sprout, title: "Grow", desc: "Pairs meet regularly, set goals together, and celebrate progress at program completion." },
              ].map(step => (
                <div key={step.title} className="card p-5">
                  <div className="inline-flex p-2 bg-green-light rounded-lg mb-3">
                    <step.icon className="w-5 h-5 text-green-mid" />
                  </div>
                  <h3 className="text-green-dark text-sm font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-muted text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-green-light">
          <div className="container-max max-w-3xl text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Youth Safety</span>
            <h2 className="text-green-dark mt-3 mb-4">Built With Safeguards</h2>
            <p className="text-gray-muted leading-relaxed">
              Because most of our mentees are minors, every application from someone under 18
              requires a parent or guardian&rsquo;s consent before we&rsquo;ll pair them with a
              mentor. All communication happens through the program, session activity is visible
              to our team, and consent is renewed annually.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max text-center">
            <h2 className="text-green-dark mb-4">Ready to Get Involved?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link href="/mentorship/apply" className="btn-amber">Apply as a Mentee</Link>
              <Link href="/mentorship/apply-mentor" className="btn-outline">Apply as a Mentor</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
