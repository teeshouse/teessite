import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Leaf, Heart, Users, Sprout, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Tees House Inc. | Empowering Communities in Northwest Florida"
}

const featureCards = [
  { icon: Heart,  title: "Giving Back",  href: "/donate",    description: "Time, finances, or food are ways to help our organization and the community.", color: "amber" },
  { icon: Sprout, title: "Our Programs", href: "/programs",  description: "Cultivating creativity, education, and community growth through hands-on programs.", color: "green" },
  { icon: Users,  title: "Volunteer",    href: "/volunteer", description: "We welcome all with a sincere heart and a warm smile.", color: "amber" }
]

const impactStats = [
  { value: "500+", label: "Meals Provided", icon: "ðŸ¥—" },
  { value: "150+", label: "Youth Reached",  icon: "ðŸŒ±" },
  { value: "80+",  label: "Volunteers",     icon: "ðŸ¤" },
  { value: "5+",   label: "Programs",       icon: "ðŸŽ¨" }
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(45,80,22,0.92) 0%, rgba(74,124,47,0.80) 100%)" }}>
          <div className="container-max text-center px-4">
            <div className="flex justify-center mb-4">
              <Leaf className="w-12 h-12 text-amber" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Empowering Minds,<br />
              <span className="text-amber">Nourishing Bodies,</span><br />
              Building Futures.
            </h1>
            <p className="text-lg md:text-xl text-green-light max-w-2xl mx-auto mb-8 leading-relaxed">
              Tees House is a Pensacola-based nonprofit dedicated to uplifting communities
              through food access, youth development, and creative expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate"    className="btn-amber text-base px-8 py-4">Donate Today</Link>
              <Link href="/about"     className="btn-outline-white text-base px-8 py-4">Learn Our Story</Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20L0 60Z" fill="white"/>
            </svg>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container-max px-4 text-center">
            <p className="font-display text-2xl md:text-3xl text-green-dark italic max-w-3xl mx-auto">
              Real change starts at the grassroots level with neighbors helping neighbors.
            </p>
          </div>
        </section>

        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-green-dark mb-3">How You Can Help</h2>
              <p className="text-gray-muted max-w-xl mx-auto">Every seed planted, every meal shared, every hour volunteered grows into a stronger community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureCards.map((card) => {
                const Icon = card.icon
                return (
                  <Link key={card.title} href={card.href}
                    className="card p-8 text-center group hover:-translate-y-1 transition-transform duration-300">
                    <div className={`inline-flex p-4 rounded-full mb-4 ${card.color === "amber" ? "bg-amber-light" : "bg-green-light"}`}>
                      <Icon className={`w-8 h-8 ${card.color === "amber" ? "text-amber" : "text-green-mid"}`} />
                    </div>
                    <h3 className="text-green-dark mb-3 group-hover:text-green-mid transition-colors">{card.title}</h3>
                    <p className="text-gray-muted text-sm leading-relaxed mb-4">{card.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-padding bg-green-dark text-white">
          <div className="container-max">
            <div className="text-center mb-10">
              <h2 className="text-white mb-3">Our Impact</h2>
              <p className="text-green-light">Growing stronger every year together.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="font-display text-4xl font-bold text-amber mb-1">{stat.value}</div>
                  <div className="text-green-light text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Mission</span>
                <h2 className="text-green-dark mt-2 mb-4">Building a Brighter Future Together</h2>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Tees House Inc. empowers communities in Northwest Florida by addressing food insecurity,
                  fostering educational growth, and promoting mental well-being.
                </p>
                <p className="text-gray-muted leading-relaxed mb-6">
                  Through agricultural programs and holistic support, we build resilience, independence,
                  and a brighter future for individuals and families.
                </p>
                <Link href="/about" className="btn-primary">
                  Our Full Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-green-light rounded-card p-8 space-y-4">
                {[
                  { emoji: "ðŸŒ»", title: "Community Gardens",     desc: "Growing food and teaching self-sufficiency" },
                  { emoji: "ðŸŽ­", title: "Creative Arts & Youth", desc: "Art, drama, and poetry for youth expression" },
                  { emoji: "ðŸ¤", title: "Community Outreach",    desc: "Food, resources, and education for all" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div>
                      <h3 className="text-green-dark text-base mb-1">{item.title}</h3>
                      <p className="text-gray-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding-sm bg-amber">
          <div className="container-max text-center px-4">
            <h2 className="text-white mb-3">Ready to Make a Difference?</h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">Whether you donate, volunteer, or spread the word, every act of kindness plants a seed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate"    className="btn-outline-white text-base px-8 py-4">Donate Now</Link>
              <Link href="/volunteer" className="bg-white text-amber font-semibold px-8 py-4 rounded-lg hover:bg-amber-light transition-colors">Volunteer With Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}