import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowRight, Sprout, Mic2, FlaskConical, Apple, Rocket } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Programs | Tees House Inc.",
  description: "Discover how Tees House is cultivating creativity, education, and community growth through hands-on programs that nourish both people and purpose."
}

const currentPrograms = [
  {
    Icon: Sprout,
    badge: "Current 2025",
    badgeColor: "badge-current",
    title: "Agriculture & Arts Enrichment",
    desc: "Our ongoing school partnerships continue to blossom. Tees House has been actively involved in implementing agriculture and arts enrichment that enhances traditional learning with creative, hands-on experiences. Through lessons in planting, painting, and creative expression, students learn about sustainability, teamwork, and self-expression â€” all while strengthening their connection to the environment and their community."
  },
  {
    Icon: Mic2,
    badge: "Current 2025",
    badgeColor: "badge-current",
    title: "Drama & Poetry Club (Grades 3-5)",
    desc: "Through our Drama and Poetry Club, Tees House provides a safe, expressive space for students in grades 3-5 to explore their voices and share their stories. Participants study the works of notable poets, create original pieces, and perform for peers and families, building confidence and communication skills that extend far beyond the classroom. Each performance becomes a celebration of creativity, resilience, and cultural pride."
  }
]

const pastPrograms = [
  {
    Icon: Rocket,
    badge: "Past 2025",
    badgeColor: "badge-past",
    title: "STEAM Future Leaders of Northwest Florida",
    desc: "This year marked a major milestone as Tees House spearheaded the creation of the STEAM Future Leaders of NWFL 2025 Cohort, an innovative five-week experience that blended science, technology, engineering, arts, and mathematics through real-world learning. Youth explored hands-on discovery, cultivating curiosity, leadership, and teamwork â€” building the confidence to see themselves as future innovators and community changemakers."
  },
  {
    Icon: FlaskConical,
    badge: "Past 2025",
    badgeColor: "badge-past",
    title: "Science, Agriculture, and Arts Week",
    desc: "As part of the STEAM initiative, Tees House proudly facilitated Science, Agriculture, and Arts Week â€” an immersive learning journey where participants explored how creativity and cultivation intertwine. Students examined plant science, created art inspired by nature, and learned how growing food can nurture both the body and the imagination."
  },
  {
    Icon: Apple,
    badge: "Past 2025",
    badgeColor: "badge-past",
    title: "Nutrition Course: From Garden to Smoothie",
    desc: "Tees House hosted an engaging nutrition course that taught students about healthy eating and homegrown ingredients. Participants explored fruits and vegetables that can be grown locally, then transformed those ingredients into vibrant, nutrient-rich smoothies â€” combining wellness education with practical skills."
  }
]

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-green-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Our Programs</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto leading-relaxed">
              At Tees House, we believe growth begins with connection â€” between people, purpose, and the planet.
              Each program is designed to nourish the mind, the body, and the spirit.
            </p>
          </div>
        </section>

        {/* Current Programs */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Active Now</span>
              <h2 className="text-green-dark mt-3">Current 2025 Programs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentPrograms.map((p) => (
                <div key={p.title} className="card p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-green-light rounded-lg shrink-0">
                      <p.Icon className="w-6 h-6 text-green-mid" />
                    </div>
                    <div>
                      <span className={`${p.badgeColor} mb-2 inline-block`}>{p.badge}</span>
                      <h3 className="text-green-dark text-xl">{p.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-muted text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2026 Teaser */}
        <section className="section-padding bg-amber">
          <div className="container-max text-center">
            <span className="badge-upcoming mb-4 inline-block">Coming 2026</span>
            <h2 className="text-white mb-4">Something Extraordinary Is Coming</h2>
            <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-lg">
              We are preparing a first-of-its-kind program launching in 2026. This initiative will
              expand our vision by merging educational enrichment with supportive workforce development
              practices that prepare youth not just for education, but for life.
            </p>
            <p className="text-white/80 mt-4 font-display italic">
              While the full name and details remain under wraps, one thing is certain: this next
              chapter will inspire transformation, innovation, and purpose at every level.
            </p>
            <Link href="/contact" className="btn-outline-white mt-8 inline-flex">
              Stay Informed <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Past Programs */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Program History</span>
              <h2 className="text-green-dark mt-3">2025 Program Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastPrograms.map((p) => (
                <div key={p.title} className="card p-7">
                  <div className="p-3 bg-white rounded-lg inline-flex mb-4">
                    <p.Icon className="w-6 h-6 text-gray-muted" />
                  </div>
                  <span className={`${p.badgeColor} mb-3 inline-block`}>{p.badge}</span>
                  <h3 className="text-green-dark text-lg mb-3">{p.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding-sm bg-green-dark text-white">
          <div className="container-max text-center px-4">
            <p className="font-display text-2xl italic text-green-light mb-6">
              Together, we can plant the ideas that will nourish generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/volunteer" className="btn-amber">Get Involved <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/donate"    className="btn-outline-white">Support Our Programs <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}