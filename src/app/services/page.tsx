import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getSiteSettings, getServices, getDownloads } from "@/lib/sanity.fetch"
import { ArrowRight, Mail, Phone, Check, Star, Sparkles, FileDown, ShoppingBag } from "lucide-react"
import type { Service } from "@/types"

export const revalidate = 60

export const metadata: Metadata = {
  title:       "Fundraisers & Offerings | Tee’s House Inc.",
  description: "Workshops, program support, full implementation, and curated kits from Tee’s House Inc. in Pensacola, FL.",
}

/* ── Fallback service tiers (used until Tierra adds them in Sanity) ── */
const FALLBACK_TIERS: Service[] = [
  {
    _id: "t1", category: "service", tierNumber: 1, title: "Workshops",
    price: "starting at $10 per person",
    features: [
      "Introduction to gardening practices",
      "Basic topics (soil, planting, watering, seasonal awareness)",
      "Interactive group engagement activities",
      "Q&A session with participants",
    ],
  },
  {
    _id: "t2", category: "service", tierNumber: 2, title: "Program Support",
    price: "$250 per session + Programming Supplies",
    badge: "Most Popular",
    features: [
      "Everything in Tier 1 PLUS:",
      "Scheduled instructional support",
      "Garden planning guidance",
      "Pest and maintenance education",
    ],
  },
  {
    _id: "t3", category: "service", tierNumber: 3, title: "Program Implementation",
    price: "Contact for Quote",
    priceNote: "Fall / Spring Sessions",
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

/* ── Fallback kits (used until Tierra adds them in Sanity) ─────────── */
const FALLBACK_KITS: Service[] = [
  {
    _id: "k1", category: "kit", title: "Growth with Confidence",
    price: "Ag Kit", comingSoon: true,
    tagline: "Start your gardening journey with ease. Perfect for beginners ready to grow something real.",
    items: ["Planting Guide", "Planting Pot", "Nutrient-rich soil", "2 packs of seeds"],
  },
  {
    _id: "k2", category: "kit", title: "Create & Bloom",
    price: "Art Kit", comingSoon: true,
    tagline: "A space dedicated purely to creativity — no rules, just expression.",
    items: ["Pre-sketched canvas", "Art supplies", "Small creativity journal"],
  },
  {
    _id: "k3", category: "kit", title: "Grow & Glow",
    price: "Ag & Arts Kit", comingSoon: true,
    tagline: "Where creativity meets growth — design, plant, and express all in one experience.",
    items: ["Planting Guide", "Planting pot", "Nutrient-rich soil", "2 packs of seeds", "Pot decorating supplies", "Small creative journal", "“Share with Tee” creative prompt"],
  },
  {
    _id: "k4", category: "kit", title: "Thrive Monthly",
    price: "Subscription Kit", comingSoon: true, isSubscription: true,
    tagline: "An ongoing experience delivered to inspire growth, creativity, and connection every month.",
    items: ["Ag & Arts Kit*", "A2 Club Access", "Seasonal seeds", "Creative Wellness Sheet"],
    kitNotes: ["*One per subscription", "**Monthly subscription received through snail mail"],
  },
]

export default async function ServicesPage() {
  const [settings, allServices, allDownloads] = await Promise.all([
    getSiteSettings(),
    getServices() as Promise<Service[]>,
    getDownloads(),
  ])

  const downloads   = (allDownloads || []).filter((d: any) => d.showOnServicesPage)
  const phone       = settings?.phone || "850.291.1888"

  // Use Sanity data if available, otherwise fall back to hardcoded arrays
  const sanityTiers = (allServices || []).filter((s) => s.category === "service")
  const sanityKits  = (allServices || []).filter((s) => s.category === "kit")
  const tiers       = sanityTiers.length > 0 ? sanityTiers.sort((a, b) => (a.tierNumber ?? 99) - (b.tierNumber ?? 99)) : FALLBACK_TIERS
  const kits        = sanityKits.length  > 0 ? sanityKits  : FALLBACK_KITS

  const anyComingSoon = kits.some((k) => k.comingSoon)

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
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Products &amp; Services</h1>
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
              {tiers.map((tier, idx) => {
                const tierNum = tier.tierNumber ?? (idx + 1)
                const isDark  = tierNum === 3
                const isPopular = !!tier.badge
                return (
                  <div key={tier._id}
                    className={`relative card overflow-hidden flex flex-col ${isPopular ? "border-2 border-amber ring-2 ring-amber/20" : ""}`}>
                    {tier.badge && (
                      <div className="bg-amber text-white text-xs font-bold uppercase tracking-wider text-center py-1.5">
                        <Star className="w-3 h-3 inline -mt-0.5 mr-1" />{tier.badge}
                      </div>
                    )}
                    <div className={`p-6 ${tierNum === 1 ? "bg-green-light" : tierNum === 2 ? "bg-amber/10" : "bg-green-dark text-white"}`}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 text-amber">Tier {tierNum}</p>
                      <h3 className={`text-2xl font-display font-bold ${isDark ? "text-white" : "text-green-dark"}`}>{tier.title}</h3>
                      <p className={`text-sm mt-2 font-semibold ${isDark ? "text-green-light" : "text-gray-body"}`}>{tier.price}</p>
                      {tier.priceNote && (
                        <p className={`text-xs mt-1 ${isDark ? "text-green-light/70" : "text-gray-muted"}`}>{tier.priceNote}</p>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <ul className="space-y-3 flex-1">
                        {(tier.features || []).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-body">
                            <Check className="w-4 h-4 text-green-mid shrink-0 mt-0.5" /><span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      {tier.extras && tier.extras.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-gray-border">
                          <p className="text-xs font-bold uppercase tracking-widest text-amber mb-3">
                            <Sparkles className="w-3 h-3 inline -mt-0.5 mr-1" />Optional Enhancements
                          </p>
                          <ul className="space-y-2">
                            {tier.extras.map((e) => (
                              <li key={e} className="flex items-start gap-2 text-sm text-gray-muted">
                                <Check className="w-4 h-4 text-amber shrink-0 mt-0.5" /><span>{e}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Link href="/contact"
                        className={`mt-6 text-sm text-center py-3 rounded-lg font-semibold transition-colors
                          ${isPopular ? "btn-amber w-full justify-center" : "btn-outline w-full justify-center"}`}>
                        {tierNum === 3 ? "Request a Quote" : "Get Started"}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Kit Showcase */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Take Home the Mission</span>
              <h2 className="text-green-dark mt-3">Kit Showcase</h2>
              <p className="text-gray-muted max-w-lg mx-auto mt-2">
                Curated kits that bring the Tee&rsquo;s House experience home &mdash; perfect for families, classrooms, and community groups.
              </p>
            </div>
            {anyComingSoon && (
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 bg-amber/10 border border-amber text-amber text-sm font-semibold px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" /> Coming Soon &mdash; Pre-sales open last 2 weeks of May &bull; Debut in June
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {kits.map((kit) => (
                <div key={kit._id}
                  className={`card overflow-hidden hover:-translate-y-1 transition-transform duration-300
                    ${kit.isSubscription ? "md:col-span-2 border-2 border-amber" : ""}`}>
                  <div className={`flex items-center gap-4 p-5 ${kit.isSubscription ? "bg-amber/10" : "bg-white"}`}>
                    {kit.image?.asset?.url ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Image src={kit.image.asset.url} alt={kit.title} fill className="object-cover" sizes="48px" />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
                        ${kit.isSubscription ? "bg-amber/20" : "bg-green-light"}`}>
                        <ShoppingBag className={`w-6 h-6 ${kit.isSubscription ? "text-amber" : "text-green-mid"}`} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-green-dark text-lg font-bold leading-tight">{kit.title}</h3>
                      {kit.price && <p className="text-amber text-sm font-semibold">{kit.price}</p>}
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    {(kit.items || []).length > 0 && (
                      <>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-muted mt-4 mb-3">
                          What&rsquo;s Included{kit.isSubscription ? " Each Month" : ""}:
                        </p>
                        <ul className="space-y-2 mb-4">
                          {(kit.items || []).map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-body">
                              <Check className="w-4 h-4 text-green-mid shrink-0 mt-0.5" /><span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {kit.kitNotes && kit.kitNotes.length > 0 && (
                      <div className="text-xs text-gray-muted space-y-0.5 mb-3">
                        {kit.kitNotes.map((n) => <p key={n}>{n}</p>)}
                      </div>
                    )}
                    {kit.tagline && (
                      <p className="text-sm text-gray-muted italic border-t border-gray-border pt-3">{kit.tagline}</p>
                    )}
                    <div className="mt-4">
                      {kit.comingSoon || !kit.paypalUrl ? (
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber bg-amber/10 px-3 py-1.5 rounded-full border border-amber/30">
                          <Sparkles className="w-3 h-3" /> Coming Soon
                        </span>
                      ) : (
                        <a href={kit.paypalUrl} target="_blank" rel="noopener noreferrer"
                          className="btn-amber text-sm py-2 w-full justify-center">
                          Buy Now &mdash; {kit.price}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Downloads */}
        {downloads.length > 0 && (
          <section className="section-padding bg-white">
            <div className="container-max">
              <div className="text-center mb-12">
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Resources</span>
                <h2 className="text-green-dark mt-3">Downloads &amp; Flyers</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {downloads.map((doc: any) => (
                  <a key={doc._id} href={doc.file?.asset?.url}
                    target="_blank" rel="noopener noreferrer"
                    className="card overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    {doc.thumbnail?.asset?.url ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image src={doc.thumbnail.asset.url} alt={doc.title} fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-32 bg-green-light flex items-center justify-center">
                        <FileDown className="w-10 h-10 text-green-mid" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-green-dark font-semibold mb-1 group-hover:text-green-mid transition-colors">{doc.title}</h3>
                      {doc.description && <p className="text-gray-muted text-sm mb-3">{doc.description}</p>}
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber">
                        <FileDown className="w-4 h-4" /> Download PDF
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

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
