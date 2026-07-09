import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getPrograms, getSiteSettings } from "@/lib/sanity.fetch"
import { resolveProgramsLabels } from "@/lib/programsPageLabels"
import { ArrowRight, Mail, Phone } from "lucide-react"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const labels   = resolveProgramsLabels(settings)
  return {
    title:       labels.metaTitle,
    description: labels.metaDescription,
  }
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

const STATIC = {
  hero:       `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`,
  agArts:     `${CDN}/d849d6072cf5ef6e1b989b58751d39a5c9db6429-791x1024.png`,
  steam:      `${CDN}/12d97e682a4bcfaf6bffd975049995ef053d2912-791x1024.png`,
  sciAgArts:  `${CDN}/9c348db91699c9ead8a73d1eaf6138ae3ddb5f7a-791x1024.png`,
  nutrition:  `${CDN}/bb4ea2ce4eeb41f0d3d59e90835d29115b73dcd8-1024x1024.png`,
  community:  `${CDN}/1fc83a1ef9faa8ff2552ba2ae09a1bc44b29a745-1024x1024.png`
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "current":  return <span className="badge-current">Current 2025</span>
    case "past":     return <span className="badge-past">Past 2025</span>
    case "upcoming": return <span className="badge-upcoming">Coming 2026</span>
    default: return null
  }
}

export default async function ProgramsPage() {
  const [programs, settings] = await Promise.all([getPrograms(), getSiteSettings()])
  const labels    = resolveProgramsLabels(settings)
  const current   = programs.filter((p: any) => p.status === "current")
  const past      = programs.filter((p: any) => p.status === "past")
  const hasContent = programs.length > 0

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image src={STATIC.hero} alt="Tee’s House programs" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">{labels.pageKicker}</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">{labels.pageTitle}</h1>
          </div>
        </section>

        {/* Intro */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl text-center">
            <p className="font-display italic text-green-dark text-xl md:text-2xl leading-relaxed">
              At Tee’s House, we believe growth begins with connection between people, purpose, and the planet.
              Each program we create is designed to nourish the mind, the body, and the spirit while building
              stronger, more resilient communities. Our work reflects the heart of that mission,
              weaving together agriculture and arts to help young leaders blossom.
            </p>
          </div>
        </section>

        {/* Current Programs */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Active Now</span>
              <h2 className="text-green-dark mt-3">Current 2026 Programs</h2>
            </div>

            {hasContent && current.length > 0 ? (
              <div className="space-y-16">
                {current.map((p: any, i: number) => (
                  <div key={p._id} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center`}>
                    <div className={`relative h-96 rounded-card overflow-hidden shadow-card-hover ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                      <Image src={p.image?.asset?.url || STATIC.agArts} alt={p.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                      <div className="mb-4"><StatusBadge status={p.status} /></div>
                      <h3 className="text-green-dark text-2xl mb-4">{p.title}</h3>
                      {p.description?.map((block: any, j: number) => (
                        <p key={j} className="text-gray-muted leading-relaxed mb-3">
                          {block.children?.map((c: any) => c.text).join("")}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-16">
                {/* Community Garden */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="relative h-[480px] rounded-card overflow-hidden shadow-card-hover bg-green-light">
                    <Image src="/images/community-garden.png" alt="Community Garden" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
                  </div>
                  <div>
                    <span className="badge-current mb-4 inline-block">Current 2026</span>
                    <h3 className="text-green-dark text-2xl mb-4">Community Garden</h3>
                    <p className="text-gray-muted leading-relaxed mb-4">
                      Our Community Garden serves as a living classroom where participants of all ages come together
                      to grow fresh produce, build sustainable habits, and strengthen community bonds through the
                      shared experience of cultivation.
                    </p>
                    <p className="text-gray-muted leading-relaxed">
                      From planting seeds to harvesting crops, participants develop practical agriculture skills
                      while connecting with the environment and each other.
                    </p>
                  </div>
                </div>
                {/* Mobile Garden */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <a href="/images/mobile-garden.png" target="_blank" rel="noopener noreferrer"
                    className="md:order-2 relative h-[480px] rounded-card overflow-hidden shadow-card-hover bg-white block group cursor-zoom-in">
                    <Image src="/images/mobile-garden.png" alt="Mobile Garden" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute bottom-3 right-3 bg-green-dark/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view full flyer
                    </div>
                  </a>
                  <div className="md:order-1">
                    <span className="badge-current mb-4 inline-block">Current 2026</span>
                    <h3 className="text-green-dark text-2xl mb-4">Mobile Garden</h3>
                    <p className="text-gray-muted leading-relaxed mb-4">
                      The Tee&apos;s House Mobile Garden brings agriculture education directly to schools, community
                      events, and organizations throughout the Pensacola area &mdash; removing barriers and making
                      hands-on learning accessible wherever it&apos;s needed most.
                    </p>
                    <p className="text-gray-muted leading-relaxed">
                      Participants experience the joy of planting, tending, and harvesting in a portable
                      garden environment designed to spark curiosity and connection.
                    </p>
                  </div>
                </div>
                {/* A2 Club */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="relative h-96 rounded-card overflow-hidden shadow-card-hover">
                    <Image src="/images/a2-club.jpg" alt="A2 Club" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div>
                    <span className="badge-current mb-4 inline-block">Current 2026</span>
                    <h3 className="text-green-dark text-2xl mb-4">A2 Club</h3>
                    <p className="text-gray-muted leading-relaxed mb-4">
                      The Agriculture &amp; Arts (A2) Club is a Tee's House hybrid enrichment access that combines
                      in-person and virtual learning experiences focused on gardening, creative expression, wellness,
                      and life skills development. The A2 Club creates meaningful experiences that empower youth, families,
                      and community members to grow, create, and thrive.
                    </p>
                    <p className="text-gray-muted leading-relaxed">
                      Through experience of collaborating in planting, painting, and creative discovery, REGARDLESS OF LOCATION, club members develop
                      sustainability awareness, teamwork, and self-expression while deepening their connection
                      to the environment and their community.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Past Programs */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Program History</span>
              <h2 className="text-green-dark mt-3">Previous 2025 Program Highlights</h2>
            </div>

            {hasContent && past.length > 0 ? (
              <div className="space-y-16">
                {past.map((p: any, i: number) => (
                  <div key={p._id} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className={`relative h-96 rounded-card overflow-hidden shadow-card-hover ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                      <Image src={p.image?.asset?.url || STATIC.steam} alt={p.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                      <div className="mb-4"><StatusBadge status={p.status} /></div>
                      <h3 className="text-green-dark text-2xl mb-4">{p.title}</h3>
                      {p.description?.map((block: any, j: number) => (
                        <p key={j} className="text-gray-muted leading-relaxed mb-3">
                          {block.children?.map((c: any) => c.text).join("")}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-16">
                {[
                  { img: "/images/creative-arts-club.jpg", title: "Creative Arts Club",
                    p1: "Through the Creative Arts Club, Tee’s House provided a safe, expressive space for community members to explore creative arts and cultural expression through song, dance, poetry, and creativity.",
                    p2: "Participants immersed themselves in an inspiring experience that celebrated artistic voice and community connection." },
                  { img: STATIC.steam, title: "STEAM Future Leaders of Northwest Florida",
                    p1: "This year marked a major milestone as Tee’s House spearheaded the creation of the STEAM Future Leaders of NWFL 2025 Cohort, an innovative five-week experience that blended science, technology, engineering, arts, and mathematics through real-world learning.",
                    p2: "Throughout the program, youth explored hands-on discovery in a way that connected education to everyday life. Participants cultivated curiosity, leadership, and teamwork." },
                  { img: STATIC.sciAgArts, title: "Science, Agriculture, and Arts Week",
                    p1: "As part of the STEAM initiative, Tee’s House proudly facilitated the Science, Agriculture, and Arts Week, an immersive learning journey where participants explored how creativity and cultivation intertwine.",
                    p2: "Students examined plant science, created art inspired by nature, and learned how growing food can nurture both the body and the imagination." },
                  { img: STATIC.nutrition, title: "Nutrition Course: From Garden to Smoothie",
                    p1: "In 2025, Tee’s House hosted an engaging nutrition course that taught students about healthy eating and homegrown ingredients.",
                    p2: "The course combined wellness education with practical skills, reminding everyone that nourishment can be both simple and joyful when it begins with the earth." },
                ].map((item, i) => (
                  <div key={item.title} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className={`relative h-96 rounded-card overflow-hidden shadow-card-hover ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                      <Image src={item.img} alt={item.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                      <span className="badge-past mb-4 inline-block">Past 2025</span>
                      <h3 className="text-green-dark text-2xl mb-4">{item.title}</h3>
                      <p className="text-gray-muted leading-relaxed mb-3">{item.p1}</p>
                      <p className="text-gray-muted leading-relaxed">{item.p2}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="font-display italic text-2xl md:text-3xl text-green-light leading-relaxed mb-8">
                  Together, we can plant the ideas that will nourish generations to come.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  <a href="mailto:info@teeshouse.org" className="flex items-center gap-3 text-green-light hover:text-amber transition-colors">
                    <Mail className="w-5 h-5 text-amber shrink-0" />info@teeshouse.org
                  </a>
                  <a href="tel:8502911888" className="flex items-center gap-3 text-green-light hover:text-amber transition-colors">
                    <Phone className="w-5 h-5 text-amber shrink-0" />850.291.1888
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/volunteer" className="btn-amber">Get Involved <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/donate"    className="btn-outline-white">Support Programs <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
              <div className="relative h-72 rounded-card overflow-hidden shadow-card-hover">
                <Image src={STATIC.community} alt="Tee’s House community" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
