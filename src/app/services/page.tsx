import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getSiteSettings } from "@/lib/sanity.fetch"
import { ArrowRight, Package, Wrench, Mail, ShoppingBag, Leaf, Heart } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title:       "Products & Services | Tee\u2019s House Inc.",
  description: "Explore kits, services, and community offerings from Tee\u2019s House Inc. in Pensacola, FL.",
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

/**
 * Placeholder kits and services until Tierra populates content in Sanity.
 * These can be moved to a CMS document type later.
 */
const KITS = [
  {
    title: "Seed Starter Kit",
    description:
      "Everything a young grower needs to start their first garden \u2014 seeds, soil pods, a mini planter, and a step-by-step grow guide.",
    icon: Leaf,
  },
  {
    title: "Creative Expression Kit",
    description:
      "Art supplies, journal prompts, and a curated activity booklet designed to spark imagination and self-expression in youth.",
    icon: ShoppingBag,
  },
  {
    title: "Wellness & Mindfulness Kit",
    description:
      "Guided breathing exercises, a stress ball, affirmation cards, and a wellness journal \u2014 tools for mental health and self-care.",
    icon: Heart,
  },
]

const SERVICES = [
  {
    title: "Community Workshop Facilitation",
    description:
      "We bring hands-on STEAM, agriculture, and wellness workshops to your school, church, or community center. Custom topics available.",
    icon: Wrench,
  },
  {
    title: "Youth Program Consulting",
    description:
      "Need help designing an after-school or summer enrichment program? We offer consulting rooted in our tested curriculum framework.",
    icon: Package,
  },
  {
    title: "Custom Kit Assembly",
    description:
      "Organizations can order custom-branded kits for events, fundraisers, or classroom distributions. Contact us for bulk pricing.",
    icon: ShoppingBag,
  },
]

export default async function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">
              What We Offer
            </span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">
              Products & Services
            </h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Kits, workshops, and consulting services that extend our mission beyond Pensacola.
            </p>
          </div>
        </section>

        {/* Kits */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">
                Take Home the Mission
              </span>
              <h2 className="text-green-dark mt-3">Kits</h2>
              <p className="text-gray-muted max-w-lg mx-auto mt-2">
                Curated kits that bring the Tee&rsquo;s House experience home &mdash; perfect for
                families, classrooms, and community groups.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {KITS.map((kit) => (
                <div
                  key={kit.title}
                  className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                    <kit.icon className="w-7 h-7 text-green-mid" />
                  </div>
                  <h3 className="text-green-dark text-xl mb-3">{kit.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">
                    {kit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">
                Extend Your Impact
              </span>
              <h2 className="text-green-dark mt-3">Services</h2>
              <p className="text-gray-muted max-w-lg mx-auto mt-2">
                Bring Tee&rsquo;s House to your community through facilitation,
                consulting, and custom kit assembly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map((svc) => (
                <div
                  key={svc.title}
                  className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-5">
                    <svc.icon className="w-7 h-7 text-amber" />
                  </div>
                  <h3 className="text-green-dark text-xl mb-3">{svc.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interested / CTA */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max max-w-2xl text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">
              Get Started
            </span>
            <h2 className="text-white mt-3 mb-4">Interested in Our Kits or Services?</h2>
            <p className="text-green-light text-lg leading-relaxed mb-8">
              Whether you want to purchase a kit, book a workshop, or explore a custom
              partnership &mdash; we would love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-amber">
                Contact Us <Mail className="w-4 h-4" />
              </Link>
              <Link href="/community-impact" className="btn-outline-white">
                See Our Programs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
