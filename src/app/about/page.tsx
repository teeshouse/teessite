import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getSiteSettings, getImpactStats, getTeam } from "@/lib/sanity.fetch"
import { resolvePageLabels } from "@/lib/pageLabels"
import type { SiteSettings } from "@/types"
import { ArrowRight, Heart, Mail, Phone, MapPin } from "lucide-react"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const labels = resolvePageLabels("about", await getSiteSettings())
  return { title: labels.metaTitle, description: labels.metaDescription }
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

const FALLBACK_STATS = [
  { label: "Youth Served",       value: "150+" },
  { label: "Programs Delivered", value: "12"   },
  { label: "Volunteers",         value: "40+"  },
  { label: "Years of Impact",    value: "5+"   },
]

export default async function AboutPage() {
  const [settings, stats, team] = await Promise.all([
    getSiteSettings(),
    getImpactStats(),
    getTeam()
  ])

  const s: Partial<SiteSettings> = settings || {}
  const labels = resolvePageLabels("about", settings)
  const iStats = stats?.length > 0 ? stats : FALLBACK_STATS

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image
            src={`${CDN}/9e83c4f80bcfcf915d8313e338c0d7fd2a531f19-2048x2048.jpg`}
            alt="About Tee’s House" fill className="object-cover"
          />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative z-10 text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">{labels.pageKicker}</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">{labels.pageTitle}</h1>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Mission</span>
                <h2 className="text-green-dark mt-3 mb-4">Cultivating Growth in Every Child</h2>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Tee’s House Inc. is a 501(c)(3) nonprofit organization dedicated to empowering youth through
                  hands-on educational experiences that integrate agriculture, arts, and STEAM learning.
                </p>
                <p className="text-gray-muted leading-relaxed mb-4">
                  We believe that every child deserves access to enriching experiences that nurture their
                  creativity, curiosity, and confidence. Our programs are designed to connect young people
                  with the natural world, with each other, and with their own potential.
                </p>
                <p className="text-gray-muted leading-relaxed">
                  Based in Pensacola, Florida, we serve youth across Northwest Florida through school
                  partnerships, community programs, and seasonal enrichment initiatives.
                </p>
              </div>
              <div className="relative h-96 rounded-card overflow-hidden shadow-card-hover">
                <Image
                  src={`${CDN}/41367ca1929bf2ddd0f8fae7dda827e0a9ddb167-1024x1024.jpg`}
                  alt="Tee’s House mission" fill className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">What Drives Us</span>
              <h2 className="text-green-dark mt-3">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Community",  desc: "We believe in the power of community to lift every individual. Everything we do is rooted in building stronger connections between people, families, and the natural world." },
                { title: "Creativity", desc: "We nurture creative expression as a fundamental human need. Through arts, drama, and hands-on making, youth discover their unique voices and strengths." },
                { title: "Growth",     desc: "We are committed to continuous growth for the youth we serve and for our organization. We learn, adapt, and improve so that our impact deepens with every season." }
              ].map((v) => (
                <div key={v.title} className="card p-8 text-center">
                  <div className="w-12 h-12 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-amber" />
                  </div>
                  <h3 className="text-green-dark text-xl mb-3">{v.title}</h3>
                  <p className="text-gray-muted leading-relaxed text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="section-padding bg-green-dark">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">By the Numbers</span>
              <h2 className="text-white mt-3">Our Impact</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {iStats.map((stat: any, i: number) => (
                <div key={i} className="text-center p-6 rounded-card bg-white/5 border border-white/10">
                  <div className="text-4xl font-bold text-amber mb-1">{stat.value}</div>
                  <div className="text-green-light text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team - pulls from Sanity */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Leadership</span>
              <h2 className="text-green-dark mt-3">Meet Our Team</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {team.length > 0 ? team.map((member: any) => (
                <div key={member._id} className="card max-w-sm text-center overflow-hidden w-full md:w-80">
                  <div className="relative h-72 overflow-hidden bg-green-light">
                    {member.photo?.asset?.url ? (
                      <Image
                        src={member.photo.asset.url}
                        alt={member.name} fill className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-green-mid opacity-30">
                          {member.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-green-dark text-xl mb-1">{member.name}</h3>
                    <p className="text-amber text-sm font-semibold mb-3">{member.title}</p>
                    {member.bio?.map((block: any, i: number) => (
                      <p key={i} className="text-gray-muted text-sm leading-relaxed mb-2">
                        {block.children?.map((c: any) => c.text).join("")}
                      </p>
                    ))}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-green-mid hover:text-amber transition-colors font-semibold mt-2">
                        View LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                // Fallback if Sanity returns empty
                <div className="card max-w-sm text-center overflow-hidden w-full md:w-80">
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={`${CDN}/9e83c4f80bcfcf915d8313e338c0d7fd2a531f19-2048x2048.jpg`}
                      alt="Tierra Smith" fill className="object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-green-dark text-xl mb-1">Tierra Smith, M.S.</h3>
                    <p className="text-amber text-sm font-semibold mb-3">Founder and Executive Director</p>
                    <p className="text-gray-muted text-sm leading-relaxed">
                      Known in the community as Big Tee, Tierra brings 12+ years of IT and Cybersecurity
                      experience together with a deep commitment to community wellness. Tech brain. Service heart. Wellness soul.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Get in Touch</span>
                <h2 className="text-green-dark mt-3 mb-6">Connect With Us</h2>
                <div className="flex flex-col gap-4 mb-8">
                  <a href="tel:8502911888" className="flex items-center gap-3 text-gray-muted hover:text-green-dark transition-colors">
                    <Phone className="w-5 h-5 text-amber shrink-0" />{s.phone || "850.291.1888"}
                  </a>
                  <a href="mailto:info@mail.teeshouse.org" className="flex items-center gap-3 text-gray-muted hover:text-green-dark transition-colors">
                    <Mail className="w-5 h-5 text-amber shrink-0" />{s.email || "info@mail.teeshouse.org"}
                  </a>
                  <span className="flex items-center gap-3 text-gray-muted">
                    <MapPin className="w-5 h-5 text-amber shrink-0" />{s.address || "7823 Bay Meadows Dr, Pensacola, FL 32507"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact"   className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/volunteer" className="btn-outline">Volunteer <Heart className="w-4 h-4" /></Link>
                </div>
              </div>
              <div className="relative h-72 rounded-card overflow-hidden shadow-card-hover">
                <Image
                  src={`${CDN}/bb80acf5b6d60378b6cff558e871c90c27240189-1024x1024.jpg`}
                  alt="Tee’s House community" fill className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}