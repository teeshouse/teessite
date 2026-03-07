import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Heart, Users, Sprout, ArrowRight, Salad, Smile, HandHeart, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Tee's House Inc. | Empowering Communities in Northwest Florida"
}

const featureCards = [
  {
    icon: Heart,
    title: "Giving Back",
    href: "/donate",
    description: "Time, finances, or food are ways to help our organization and the community.",
    color: "amber",
    image: "https://www.teeshouse.org/wp-content/uploads/2025/11/ChatGPT-Image-Nov-2-2025-06_43_51-PM-1.png"
  },
  {
    icon: Sprout,
    title: "Our Programs",
    href: "/programs",
    description: "Discover how Tee's House is cultivating creativity, education, and community growth.",
    color: "green",
    image: "https://www.teeshouse.org/wp-content/uploads/2025/11/ChatGPT-Image-Nov-3-2025-07_20_14-AM.png"
  },
  {
    icon: Users,
    title: "Volunteer",
    href: "/volunteer",
    description: "We welcome all with a sincere heart and a warm smile.",
    color: "amber",
    image: "https://www.teeshouse.org/wp-content/uploads/2025/11/ChatGPT-Image-Nov-2-2025-06_41_58-PM.png"
  }
]

const impactStats = [
  { value: "500+", label: "Meals Provided", Icon: Salad },
  { value: "150+", label: "Youth Reached",  Icon: Smile },
  { value: "80+",  label: "Volunteers",     Icon: HandHeart },
  { value: "5+",   label: "Programs",       Icon: Sparkles }
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden">
          <Image
            src="https://www.teeshouse.org/wp-content/uploads/2025/11/agriculture-and-arts-2.jpg"
            alt="Tee's House community agriculture program"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative text-center px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Empowering Minds,<br />
              <span className="text-amber">Nourishing Bodies,</span><br />
              Building Futures.
            </h1>
            <p className="text-lg md:text-xl text-green-light max-w-2xl mx-auto mb-8 leading-relaxed">
              Tee&apos;s House is a Pensacola-based nonprofit dedicated to uplifting communities
              through food access, youth development, and creative expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate"    className="btn-amber text-base px-8 py-4">Donate Today</Link>
              <Link href="/about"     className="btn-outline-white text-base px-8 py-4">Learn Our Story</Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20L0 60Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Tagline */}
        <section className="py-12 bg-white">
          <div className="container-max px-4 text-center">
            <p className="font-display text-2xl md:text-3xl text-green-dark italic max-w-3xl mx-auto">
              Real change starts at the grassroots level with neighbors helping neighbors.
            </p>
          </div>
        </section>

        {/* Feature Cards with Photos */}
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
                    className="card group hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-green-dark/30 group-hover:bg-green-dark/20 transition-colors" />
                      <div className={`absolute top-3 left-3 p-2 rounded-full ${card.color === "amber" ? "bg-amber" : "bg-green-mid"}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-green-dark mb-2 group-hover:text-green-mid transition-colors">{card.title}</h3>
                      <p className="text-gray-muted text-sm leading-relaxed mb-3">{card.description}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max">
            <div className="text-center mb-10">
              <h2 className="text-white mb-3">Our Impact</h2>
              <p className="text-green-light">Growing stronger every year together.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-3">
                    <stat.Icon className="w-10 h-10 text-green-light" />
                  </div>
                  <div className="font-display text-4xl font-bold text-amber mb-1">{stat.value}</div>
                  <div className="text-green-light text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Mission</span>
                <h2 className="text-green-dark mt-2 mb-4">Building a Brighter Future Together</h2>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Tee&apos;s House Inc. empowers communities in Northwest Florida by addressing food insecurity,
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
              <div className="relative h-80 rounded-card overflow-hidden shadow-card-hover">
                <Image
                  src="https://www.teeshouse.org/wp-content/uploads/2025/11/create-a-graphic-that-focuses-on-agriculture-and-arts-program-8-1024x1024.jpg"
                  alt="Tee's House Agriculture and Arts Program"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
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