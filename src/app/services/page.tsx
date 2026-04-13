import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getSiteSettings, getServices } from "@/lib/sanity.fetch"
import { ArrowRight, Mail, Phone, Check, Leaf, Heart, ShoppingBag, Package, Star, Sparkles } from "lucide-react"
import type { Service } from "@/types"

export const revalidate = 60

export const metadata: Metadata = {
  title:       "Products & Services | Tee\u2019s House Inc.",
  description: "Workshops, program support, full implementation, and curated kits from Tee\u2019s House Inc. in Pensacola, FL.",
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

/* ── Service tiers from Tierra's flyer ─────────────────────── */
const SERVICE_TIERS = [
  {
    tier: 1,
    name: "Workshops",
    price: "$250 per session",
    color: "green-mid",
    features: [
      "Introduction to gardening practices",
      "Basic topics (soil, planting, watering, seasonal awareness)",
      "Interactive group engagement activities",
      "Q&A session with participants",
    ],
  },
  {
    tier: 2,
    name: "Program Support",
    price: "$250 per session + Programming Supplies",
    color: "amber",
    badge: "Most Popular",
    features: [
      "Everything in Tier 1 PLUS:",
      "Scheduled instructional support",
      "Garden planning guidance",
      "Pest and maintenance education",
    ],
  },
  {
    tier: 3,
    name: "Program Implementation",
    price: "Contact for Quote",
    priceNote: "Fall / Spring Sessions",
    color: "green-dark",
    features: [
      "Full program design",
      "Structured sessions",
      "Garden installation guidance",
      "Seasonal crop planning specific to area climate",
    ],
    extras: [
      "Urban farming modules",
      "Nutrition & food education tie-ins",
      "Harvest days or community events",
    ],
  },
]

/* ── Kit fallbacks (until Tierra adds them in Sanity) ──────── */
const FALLBACK_KITS = [
  { title: "Seed Starter Kit",           description: "Everything a young grower needs to start their first garden \u2014 seeds, soil pods, a mini planter, and a step-by-step grow guide." },
  { title: "Creative Expression Kit",    description: "Art supplies, journal prompts, and a curated activity booklet designed to spark imagination and self-expression in youth." },
  { title: "Wellness & Mindfulness Kit", description: "Guided breathing exercises, a stress ball, affirmation cards, and a wellness journal \u2014 tools for mental health and self-care." },
]

const KIT_ICONS: Record<string, typeof Leaf> = {
  "Seed Starter Kit": Leaf, "Creative Expression Kit": ShoppingBag, "Wellness & Mindfulness Kit": Heart,
}

export default async function ServicesPage() {
  const [settings, allServices] = await Promise.all([
    getSiteSettings(),
    getServices() as Promise<Service[]>,
  ])

  const kits = allServices.filter(s => s.category === "kit")
  const displayKits = kits.length > 0 ? kits : FALLBACK_KITS

  const phone = settings?.phone || "850.291.1888"

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-green-dark text-white py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 70% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Growing Knowledge, Cultivating Community</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Products & Services</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto">
              From single workshops to full program implementation, we bring hands-on agriculture and education experiences to your school, organization, or community.
            </p>
          </div>
        </section>

        {/* Service Tiers */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-14">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Service Tiers</span>
              <h2 className="text-green-dark mt-3">Choose Your Level of Support</h2>
              <p className="text-gray-muted max-w-lg mx-auto mt-2">
                Each tier builds on the last. Start with a single workshop or go all-in with a full seasonal program.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {SERVICE_TIERS.map((tier) => (
                <div key={tier.tier}
                  className={`relative card overflow-hidden flex flex-col ${tier.badge ? "border-2 border-amber ring-2 ring-amber/20" : ""}`}>
                  {tier.badge && (
                    <div className="bg-amber text-white text-xs font-bold uppercase tracking-wider text-center py-1.5">
                      <Star className="w-3 h-3 inline -mt-0.5 mr-1" />{tier.badge}
                    </div>
                  )}
                  <div className={`p-6 ${tier.tier === 1 ? "bg-green-light" : tier.tier === 2 ? "bg-amber/10" : "bg-green-dark text-white"}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${tier.tier === 3 ? "text-amber" : "text-amber"}`}>
                      Tier {tier.tier}
                    </p>
                    <h3 className={`text-2xl font-display font-bold ${tier.tier === 3 ? "text-white" : "text-green-dark"}`}>
                      {tier.name}
                    </h3>
                    <p className={`text-sm mt-2 font-semibold ${tier.tier === 3 ? "text-green-light" : "text-gray-body"}`}>
                      {tier.price}
                    </p>
                    {tier.priceNote && (
                      <p className={`text-xs mt-1 ${tier.tier === 3 ? "text-green-light/70" : "text-gray-muted"}`}>
                        {tier.priceNote}
                      </p>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-body">
                          <Check className="w-4 h-4 text-green-mid shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {tier.extras && (
                      <div className="mt-5 pt-4 border-t border-gray-border">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber mb-3">
                          <Sparkles className="w-3 h-3 inline -mt-0.5 mr-1" />Optional Enhancements
                        </p>
                        <ul className="space-y-2">
                          {tier.extras.map((e) => (
                            <li key={e} className="flex items-start gap-2 text-sm text-gray-muted">
                              <Check className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Link href="/contact"
                      className={`mt-6 text-sm text-center py-3 rounded-lg font-semibold transition-colors
                        ${tier.tier === 2
                          ? "btn-amber w-full justify-center"
                          : "btn-outline w-full justify-center"}`}>
                      {tier.tier === 3 ? "Request a Quote" : "Get Started"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kits */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Take Home the Mission</span>
              <h2 className="text-green-dark mt-3">Kit Showcase</h2>
              <p className="text-gray-muted max-w-lg mx-auto mt-2">
                Curated kits that bring the Tee&rsquo;s House experience home &mdash; perfect for families, classrooms, and community groups.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayKits.map((item: any) => {
                const Icon = KIT_ICONS[item.title] || Package
                const imgUrl = item.image?.asset?.url
                return (
                  <div key={item.title} className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                    {imgUrl ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-5">
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

        {/* CTA */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max max-w-2xl text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Call Us Today to Schedule</span>
            <h2 className="text-white mt-3 mb-4">Ready to Bring Tee&rsquo;s House to Your Community?</h2>
            <p className="text-green-light text-lg leading-relaxed mb-8">
              Whether you want to book a workshop, purchase a kit, or implement a full seasonal program &mdash; we would love to connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-amber">
                Contact Us <Mail className="w-4 h-4" />
              </Link>
              <a href={`tel:${phone.replace(/[^0-9]/g, "")}`} className="btn-outline-white">
                <Phone className="w-4 h-4" /> {phone}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
