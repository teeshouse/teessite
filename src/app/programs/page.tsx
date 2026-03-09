import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getPrograms } from "@/lib/sanity.fetch"
import { ArrowRight, Mail, Phone } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Our Programs | Tee's House Inc.",
  description: "Discover how Tee's House is cultivating creativity, education, and community growth."
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

// Fallback static images (Sanity CDN)
const STATIC = {
  hero:       `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`,
  agArts:     `${CDN}/d849d6072cf5ef6e1b989b58751d39a5c9db6429-791x1024.png`,
  drama:      `${CDN}/fb1285155215793f7f340a26881f59dc7a39ea80-1024x1024.png`,
  teaser2026: `${CDN}/867597c1f3179b3dded2f23d5e40b650394730d4-1024x1024.png`,
  steam:      `${CDN}/12d97e682a4bcfaf6bffd975049995ef053d2912-791x1024.png`,
  sciAgArts:  `${CDN}/9c348db91699c9ead8a73d1eaf6138ae3ddb5f7a-791x1024.png`,
  nutrition:  `${CDN}/bb4ea2ce4eeb41f0d3d59e90835d29115b73dcd8-1024x1024.png`,
  community:  `${CDN}/1fc83a1ef9faa8ff2552ba2ae09a1bc44b29a745-1024x1024.png`
}

function getStatusBadge(status: string) {
  switch (status) {
    case "current":  return <span className="badge-current">Current 2025</span>
    case "past":     return <span className="badge-past">Past 2025</span>
    case "upcoming": return <span className="badge-upcoming">Coming 2026</span>
    default: return null
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms()
  const current  = programs.filter((p: any) => p.status === "current")
  const past     = programs.filter((p: any) => p.status === "past")
  const upcoming = programs.filter((p: any) => p.status === "upcoming")

  // Use static content if Sanity has no programs yet
  const hasContent = programs.length > 0

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image src={STATIC.hero} alt="Tee's House programs" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Our Programs</h1>
          </div>
        </section>

        {/* Intro */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl text-center">
            <p className="font-display italic text-green-dark text-xl md:text-2xl leading-relaxed">
              At Tee&apos;s House, we believe growth begins with connection â€” between people, purpose, and the planet.
              Each program we create is designed to nourish the mind, the body, and the spirit while building stronger,
              more resilient communities. Our work in 2025 reflects the heart of that mission, weaving together science,
              creativity, agriculture, and the arts to help young leaders blossom.
            </p>
          </div>
        </section>

        {/* Current Programs */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Active Now</span>
              <h2 className="text-green-dark mt-3">Current 2025 Programs</h2>
            </div>

            {hasContent && current.length > 0 ? (
              <div className="space-y-16">
                {current.map((p: any, i: number) => (
                  <div key={p._id} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center`}>
                    <div className={`relative h-96 rounded-card overflow-hidden shadow-card-hover ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                      <Image
                        src={p.image?.asset?.url || STATIC.agArts}
                        alt={p.title} fill className="object-cover"
                      />
                    </div>
                    <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                      <div className="mb-4">{getStatusBadge(p.status)}</div>
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
              // Static fallback
              <div className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="relative h-96 rounded-card overflow-hidden shadow-card-hover">
                    <Image src={STATIC.agArts} alt="Agriculture and Arts Enrichment" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="badge-current mb-4 inline-block">Current 2025</span>
                    <h3 className="text-green-dark text-2xl mb-4">Agriculture &amp; Arts Enrichment</h3>
                    <p className="text-gray-muted leading-relaxed mb-4">
                      Our ongoing school partnerships continue to blossom. Tee&apos;s House has been actively involved
                      in implementing agriculture &amp; arts enrichment that enhances traditional learning with creative,
                      hands-on experiences.
                    </p>
                    <p className="text-gray-muted leading-relaxed">
                      Through lessons in planting, painting, and creative expression, students learn about sustainability,
                      teamwork, and self-expression â€” all while strengthening their connection to the environment and their community.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="md:order-2 relative h-96 rounded-card overflow-hidden shadow-card-hover">
                    <Image src={STATIC.drama} alt="Drama and Poetry Club" fill className="object-cover" />
                  </div>
                  <div className="md:order-1">
                    <span className="badge-current mb-4 inline-block">Current 2025</span>
                    <h3 className="text-green-dark text-2xl mb-4">Drama &amp; Poetry Club (Grades 3â€“5)</h3>
                    <p className="text-gray-muted leading-relaxed mb-4">
                      Through our Drama and Poetry Club, Tee&apos;s House provides a safe, expressive space for students
                      in grades 3â€“5 to explore their voices and share their stories.
                    </p>
                    <p className="text-gray-muted leading-relaxed">
                      Participants study the works of notable poets, create original pieces, and perform for peers
                      and families, building confidence and communication skills that extend far beyond the classroom.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2026 Teaser */}
        <section className="section-padding bg-amber overflow-hidden">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="badge-upcoming mb-4 inline-block">Coming 2026</span>
                <h2 className="text-white mb-4">Looking Ahead to 2026</h2>
                <p className="text-white/90 leading-relaxed mb-4">
                  As we reflect on an incredible year of growth, we&apos;re also preparing something extraordinary â€”
                  a first-of-its-kind program launching in 2026.
                </p>
                <p className="text-white/90 leading-relaxed mb-6">
                  This initiative will expand our vision by merging educational enrichment with supportive workforce
                  development practices that prepare youth not just for education, but for life.
                </p>
                <Link href="/contact" className="btn-outline-white inline-flex">
                  Stay Informed <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative h-80 rounded-card overflow-hidden shadow-card-hover">
                <Image src={STATIC.teaser2026} alt="2026 program preview" fill className="object-cover" />
              </div>
            </div>
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
                      <Image src={p.image?.asset?.url || STATIC.steam} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                      <div className="mb-4">{getStatusBadge(p.status)}</div>
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
              // Static fallback
              <div className="space-y-16">
                {[
                  { img: STATIC.steam, title: "STEAM Future Leaders of Northwest Florida", sub: "Summer Cohort 2025",
                    p1: "This year marked a major milestone as Tee's House spearheaded the creation of the STEAM Future Leaders of NWFL 2025 Cohort, an innovative five-week experience that blended science, technology, engineering, arts, and mathematics through real-world learning.",
                    p2: "Throughout the program, youth explored hands-on discovery in a way that connected education to everyday life. Participants cultivated curiosity, leadership, and teamwork." },
                  { img: STATIC.sciAgArts, title: "Science, Agriculture, and Arts Week", sub: null,
                    p1: "As part of the STEAM initiative, Tee's House proudly facilitated the Science, Agriculture, and Arts Week, an immersive learning journey where participants explored how creativity and cultivation intertwine.",
                    p2: "Students examined plant science, created art inspired by nature, and learned how growing food can nurture both the body and the imagination." },
                  { img: STATIC.nutrition, title: "Nutrition Course: From Garden to Smoothie", sub: null,
                    p1: "In 2025, Tee's House hosted an engaging nutrition course that taught students about healthy eating and homegrown ingredients.",
                    p2: "The course combined wellness education with practical skills, reminding everyone that nourishment can be both simple and joyful when it begins with the earth." }
                ].map((item, i) => (
                  <div key={item.title} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className={`relative h-96 rounded-card overflow-hidden shadow-card-hover ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                      <Image src={item.img} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                      <span className="badge-past mb-4 inline-block">Past 2025</span>
                      <h3 className="text-green-dark text-2xl mb-2">{item.title}</h3>
                      {item.sub && <p className="text-xs text-amber font-semibold uppercase tracking-widest mb-3">{item.sub}</p>}
                      <p className="text-gray-muted leading-relaxed mb-3">{item.p1}</p>
                      <p className="text-gray-muted leading-relaxed">{item.p2}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Closing */}
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
                <Image src={STATIC.community} alt="Tee's House community" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}