import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Heart, Sprout, Leaf, Users, Sun, ArrowRight, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Giving Back | Tees House Inc.",
  description: "Support Tees House Inc. through donations, food drives, or becoming a monthly sustainer. Your contribution plants the seeds for growth, healing, and empowerment."
}

const impacts = [
  { Icon: Sprout, title: "Fight Food Insecurity",     desc: "Support urban farming and fresh food access for families in need." },
  { Icon: Leaf,   title: "Empower Through Learning",  desc: "Fund hands-on education and creative expression programs." },
  { Icon: Sun,    title: "Promote Mental Well-Being",  desc: "Sustain nature-based and holistic wellness programs." },
  { Icon: Users,  title: "Build Community",            desc: "Strengthen connections from the ground up in Northwest Florida." }
]

const ways = [
  {
    title: "Make a Donation",
    desc: "Give online through PayPal Giving Fund â€” 100% of your donation goes directly to Tees House with zero platform fees.",
    cta: "Donate via PayPal Giving Fund",
    href: "https://www.paypal.com/fundraiser/hub",
    external: true,
    color: "amber"
  },
  {
    title: "Donate Food",
    desc: "Fresh produce, non-perishables, and healthy food items are always welcome. Drop off at our Pensacola location or coordinate a food drive.",
    cta: "Contact Us to Arrange",
    href: "/contact",
    external: false,
    color: "green"
  },
  {
    title: "Give Your Time",
    desc: "Volunteer your skills and energy. From gardening to event support, there is a role for every heart.",
    cta: "Volunteer With Us",
    href: "/volunteer",
    external: false,
    color: "green"
  }
]

export default function DonatePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-green-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-amber" />
            </div>
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Support the Mission</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Sow the Seeds of Change</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto leading-relaxed">
              At Tees House, we believe community transformation begins with nourishment â€”
              of the mind, the body, and the spirit.
            </p>
          </div>
        </section>

        {/* Impact */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Your Impact</span>
              <h2 className="text-green-dark mt-3">Your Donation Helps Us</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {impacts.map((item) => (
                <div key={item.title} className="card p-6 text-center">
                  <div className="inline-flex p-3 bg-green-light rounded-full mb-4">
                    <item.Icon className="w-6 h-6 text-green-mid" />
                  </div>
                  <h3 className="text-green-dark text-base mb-2">{item.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-muted mt-8 font-display italic text-lg">
              Whether it is $5 or $500, your contribution plants the seeds for growth, healing, and empowerment.
            </p>
          </div>
        </section>

        {/* Ways to Give */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">How to Help</span>
              <h2 className="text-green-dark mt-3">Ways to Give</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ways.map((w) => (
                <div key={w.title} className="card p-8 flex flex-col">
                  <h3 className="text-green-dark text-xl mb-3">{w.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed mb-6 flex-1">{w.desc}</p>
                  {w.external ? (
                    <a href={w.href} target="_blank" rel="noopener noreferrer"
                      className="btn-amber justify-center inline-flex">
                      {w.cta} <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link href={w.href} className={`${w.color === "amber" ? "btn-amber" : "btn-primary"} justify-center`}>
                      {w.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly giving CTA */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max text-center px-4">
            <h2 className="text-white mb-4">Become a Monthly Sustainer</h2>
            <p className="text-green-light text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Make a recurring gift to keep the mission alive, vibrant, and growing.
              Monthly sustainers are the backbone of everything we do.
            </p>
            <p className="font-display text-xl italic text-amber mb-8">
              Together, let us cultivate a future where every family thrives.
            </p>
            <a href="https://www.paypal.com/fundraiser/hub" target="_blank" rel="noopener noreferrer"
              className="btn-amber text-base px-8 py-4 inline-flex items-center gap-2">
              Donate via PayPal Giving Fund <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}