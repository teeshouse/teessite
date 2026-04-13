import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getSiteSettings, getServices } from "@/lib/sanity.fetch"
import { ArrowRight, Mail, Package, Leaf, Heart, ShoppingBag, Wrench } from "lucide-react"
import type { Service } from "@/types"

export const revalidate = 60

export const metadata: Metadata = {
  title:       "Products & Services | Tee\u2019s House Inc.",
  description: "Explore kits, services, and community offerings from Tee\u2019s House Inc. in Pensacola, FL.",
}

/** Hardcoded fallbacks shown when Sanity has no service documents yet. */
const FALLBACK_KITS = [
  { title: "Seed Starter Kit",          description: "Everything a young grower needs to start their first garden \u2014 seeds, soil pods, a mini planter, and a step-by-step grow guide." },
  { title: "Creative Expression Kit",   description: "Art supplies, journal prompts, and a curated activity booklet designed to spark imagination and self-expression in youth." },
  { title: "Wellness & Mindfulness Kit", description: "Guided breathing exercises, a stress ball, affirmation cards, and a wellness journal \u2014 tools for mental health and self-care." },
]
const FALLBACK_SERVICES = [
  { title: "Community Workshop Facilitation", description: "We bring hands-on STEAM, agriculture, and wellness workshops to your school, church, or community center. Custom topics available." },
  { title: "Youth Program Consulting",        description: "Need help designing an after-school or summer enrichment program? We offer consulting rooted in our tested curriculum framework." },
  { title: "Custom Kit Assembly",              description: "Organizations can order custom-branded kits for events, fundraisers, or classroom distributions. Contact us for bulk pricing." },
]

const ICON_MAP: Record<string, typeof Leaf> = {
  "Seed Starter Kit": Leaf, "Creative Expression Kit": ShoppingBag, "Wellness & Mindfulness Kit": Heart,
  "Community Workshop Facilitation": Wrench, "Youth Program Consulting": Package, "Custom Kit Assembly": ShoppingBag,
}

export default async function ServicesPage() {
  const allServices = await getServices() as Service[]

  const kits     = allServices.filter(s => s.category === "kit")
  const services = allServices.filter(s => s.category === "service")

  const hasKits     = kits.length > 0
  const hasServices = services.length > 0

  const displayKits     = hasKits     ? kits     : FALLBACK_KITS
  const displayServices = hasServices ? services : FALLBACK_SERVICES

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Products & Services</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Kits, workshops, and consulting services that extend our mission beyond Pensacola.
            </p>
          </div>
        </section>

        {/* Kits */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Take Home the Mission</span>
              <h2 className="text-green-dark mt-3">Kits</h2>
              <p className="text-gray-muted max-w-lg mx-auto mt-2">
                Curated kits that bring the Tee&rsquo;s House experience home &mdash; perfect for families, classrooms, and community groups.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayKits.map((item: any) => {
                const Icon = ICON_MAP[item.title] || Package
                const imgUrl = item.image?.asset?.url
                return (
                  <div key={item.title} className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                    {imgUrl ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-5">
                        <Image src={imgUrl} alt={item.image?.alt || item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                        <Icon className="w-7 h-7 text-green-mid" />
                      </div>
                    )}
                    <h3 className="text-green-dark text-xl mb-3">{item.title}</h3>
                    {item.price && <p className="text-amber font-semibold text-sm mb-2">{item.price}</p>}
                    <p className="text-gray-muted text-sm leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Extend Your Impact</span>
              <h2 className="text-green-dark mt-3">Services</h2>
              <p className="text-gray-muted max-w-lg mx-auto mt-2">
                Bring Tee&rsquo;s House to your community through facilitation, consulting, and custom kit assembly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayServices.map((item: any) => {
                const Icon = ICON_MAP[item.title] || Wrench
                const imgUrl = item.image?.asset?.url
                return (
                  <div key={item.title} className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                    {imgUrl ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-5">
                        <Image src={imgUrl} alt={item.image?.alt || item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-5">
                        <Icon className="w-7 h-7 text-amber" />
                      </div>
                    )}
                    <h3 className="text-green-dark text-xl mb-3">{item.title}</h3>
                    {item.price && <p className="text-amber font-semibold text-sm mb-2">{item.price}</p>}
                    <p className="text-gray-muted text-sm leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max max-w-2xl text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Get Started</span>
            <h2 className="text-white mt-3 mb-4">Interested in Our Kits or Services?</h2>
            <p className="text-green-light text-lg leading-relaxed mb-8">
              Whether you want to purchase a kit, book a workshop, or explore a custom partnership &mdash; we would love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-amber">Contact Us <Mail className="w-4 h-4" /></Link>
              <Link href="/community-impact" className="btn-outline-white">See Our Impact <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
