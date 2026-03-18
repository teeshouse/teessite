import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getSiteSettings, getImpactStats, getFeaturedPrograms, getFeaturedNews } from "@/lib/sanity.fetch"
import { ArrowRight, Heart, Users, Sprout, Mail, Phone, MapPin } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tee's House Inc. | Growing Community in Pensacola, FL",
  description: "Tee's House Inc. is a 501(c)(3) nonprofit cultivating youth development through agriculture, arts, and education in Pensacola, Florida.",
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

const FALLBACK = {
  heroHeadline:   "Growing Community Through Agriculture, Arts and Education",
  heroSubtext:    "Tees House Inc. is a 501(c)(3) nonprofit cultivating youth development through hands-on learning experiences in Pensacola, Florida.",
  missionTagline: "Planting seeds of knowledge, creativity, and community.",
  phone:          "850.291.1888",
  email:          "info@teeshouse.org",
  address:        "7823 Bay Meadows Dr, Pensacola, FL 32507",
  paypalDonateLink: "https://www.paypal.com/donate/?hosted_button_id=XSHDRCQ2L66JW"
}

const FALLBACK_STATS = [
  { label: "Youth Served",       value: "150+", icon: "kids"       },
  { label: "Programs Delivered", value: "12",   icon: "programs"   },
  { label: "Volunteers",         value: "40+",  icon: "volunteers" },
  { label: "Years of Impact",    value: "5+",   icon: "years"      },
]

function StatIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "kids":       return <Users className="w-8 h-8 text-amber" />
    case "programs":   return <Sprout className="w-8 h-8 text-amber" />
    case "volunteers": return <Heart className="w-8 h-8 text-amber" />
    default:           return <Sprout className="w-8 h-8 text-amber" />
  }
}

export default async function HomePage() {
  const [settings, stats, programs, news] = await Promise.all([
    getSiteSettings(),
    getImpactStats(),
    getFeaturedPrograms(),
    getFeaturedNews()
  ])

  const s     = settings || FALLBACK
  const iStats = stats?.length > 0 ? stats : FALLBACK_STATS

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          <Image
            src={`${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`}
            alt="Tees House hero"
            fill className="object-cover" priority
          />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative z-10 text-center py-24">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Pensacola, Florida</span>
            <h1 className="text-white mt-4 mb-6 text-4xl md:text-6xl leading-tight max-w-4xl mx-auto">
              {s.heroHeadline}
            </h1>
            <p className="text-green-light text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {s.heroSubtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/programs" className="btn-amber">
                Our Programs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/donate" className="btn-outline-white">
                Support Our Mission <Heart className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Mission</span>
            <p className="font-display italic text-green-dark text-2xl md:text-3xl leading-relaxed mt-4">
              {s.missionTagline}
            </p>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="section-padding bg-green-dark">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Impact</span>
              <h2 className="text-white mt-3">Making a Difference</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {iStats.map((stat: any, i: number) => (
                <div key={i} className="text-center p-6 rounded-card bg-white/5 border border-white/10">
                  <StatIcon icon={stat.icon || "years"} />
                  <div className="text-4xl font-bold text-white mt-3 mb-1">{stat.value}</div>
                  <div className="text-green-light text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        {programs?.length > 0 && (
          <section className="section-padding bg-green-light">
            <div className="container-max">
              <div className="text-center mb-12">
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">What We Do</span>
                <h2 className="text-green-dark mt-3">Featured Programs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {programs.slice(0, 3).map((p: any) => (
                  <div key={p._id} className="card overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={p.image?.asset?.url || `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`}
                        alt={p.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-green-dark text-lg mb-2">{p.title}</h3>
                      <Link href="/programs" className="inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-dark transition-colors">
                        Learn More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/programs" className="btn-primary">
                  View All Programs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding bg-amber">
          <div className="container-max text-center">
            <h2 className="text-white mb-4">Ready to Make a Difference?</h2>
            <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
              Whether you donate, volunteer, or spread the word, every action helps us grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate"    className="btn-outline-white">Donate Now <Heart className="w-4 h-4" /></Link>
              <Link href="/volunteer" className="btn-outline-white">Volunteer <Users className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>

        {/* Contact strip */}
        <section className="py-10 bg-green-dark">
          <div className="container-max">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-green-light">
              {s.phone && (
                <a href={`tel:${s.phone?.replace(/\D/g,"")}`} className="flex items-center gap-2 hover:text-amber transition-colors">
                  <Phone className="w-4 h-4 text-amber" />{s.phone}
                </a>
              )}
              {s.email && (
                <a href={`mailto:${s.email}`} className="flex items-center gap-2 hover:text-amber transition-colors">
                  <Mail className="w-4 h-4 text-amber" />{s.email}
                </a>
              )}
              {s.address && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber shrink-0" />{s.address}
                </span>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}