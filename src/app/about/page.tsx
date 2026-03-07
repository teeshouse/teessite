import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowRight, Sprout, Sparkles, HandHeart, MapPin, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Tees House Inc.",
  description: "Tees House Inc. is a Pensacola-based nonprofit dedicated to uplifting communities through food access, youth development, mental health support, and creative expression."
}

const pillars = [
  {
    Icon: Sprout,
    title: "Community Gardens & Agriculture",
    desc: "We grow food and teach participants how to grow their own, building self-sufficiency and pride."
  },
  {
    Icon: Sparkles,
    title: "Creative Arts & Youth Enrichment",
    desc: "We use art, drama, and poetry to help youth express their voices and discover their strength."
  },
  {
    Icon: HandHeart,
    title: "Community Support & Outreach",
    desc: "We collaborate with schools, organizations, and local families to provide food, resources, and education that build stronger communities."
  }
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-green-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Story</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">About Tees House</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto leading-relaxed">
              A Pensacola-based nonprofit dedicated to uplifting communities through food access,
              youth development, mental health support, and creative expression.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Who We Are</span>
                <h2 className="text-green-dark mt-2 mb-5">Our Story</h2>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Tees House Inc. is a Pensacola-based nonprofit dedicated to uplifting communities
                  through food access, youth development, mental health support, and creative expression.
                  We provide hands-on programs that empower individuals and families to thrive â€” mind, body, and spirit.
                </p>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Whether it is delivering fresh meals, mentoring young leaders, or creating safe spaces
                  for healing and growth, our mission is rooted in compassion and community.
                </p>
                <p className="text-gray-muted leading-relaxed">
                  We believe real change starts at the grassroots level â€” with neighbors helping neighbors
                  and local support driving meaningful impact. Through partnerships with businesses, schools,
                  and volunteers, Tees House is creating a vibrant, inclusive ecosystem where everyone has
                  the opportunity to grow, heal, and succeed. Together, we are building more than programs â€”
                  we are building a movement.
                </p>
              </div>
              <div className="bg-green-light rounded-card p-10 text-center">
                <blockquote className="font-display text-2xl text-green-dark italic leading-relaxed">
                  "Together, we can plant the ideas that will nourish generations to come."
                </blockquote>
                <div className="mt-6 w-16 h-1 bg-amber mx-auto rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Purpose</span>
            <h2 className="text-white mt-3 mb-6">Our Mission</h2>
            <p className="text-green-light text-lg max-w-3xl mx-auto leading-relaxed">
              Tees House Inc. empowers communities in Northwest Florida by addressing food insecurity,
              fostering educational growth, and promoting mental well-being. Through agricultural programs
              and holistic support, we build resilience, independence, and a brighter future for individuals and families.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Work</span>
              <h2 className="text-green-dark mt-3">What We Do</h2>
              <p className="text-gray-muted mt-3 max-w-xl mx-auto">
                Tees House serves the community through hands-on programs and partnerships that touch every part of life.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((p) => (
                <div key={p.title} className="card p-8">
                  <div className="inline-flex p-3 bg-green-light rounded-lg mb-4">
                    <p.Icon className="w-7 h-7 text-green-mid" />
                  </div>
                  <h3 className="text-green-dark text-lg mb-3">{p.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-muted mt-8 italic">
              Every initiative at Tees House is guided by compassion, creativity, and connection.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
                <h2 className="text-green-dark mt-3 mb-4">Contact Us</h2>
                <p className="text-gray-muted mb-6">
                  We would love to hear from you. Whether you are looking to volunteer, partner,
                  or learn more about our programs, our doors are open.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-muted">
                    <MapPin className="w-5 h-5 text-amber shrink-0" />Pensacola, Florida
                  </li>
                  <li>
                    <a href="tel:8502911888" className="flex items-center gap-3 text-gray-muted hover:text-green-mid transition-colors">
                      <Phone className="w-5 h-5 text-amber shrink-0" />850.291.1888
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@teeshouse.org" className="flex items-center gap-3 text-gray-muted hover:text-green-mid transition-colors">
                      <Mail className="w-5 h-5 text-amber shrink-0" />info@teeshouse.org
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="/volunteer" className="btn-primary justify-center">
                  Volunteer With Us <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/donate" className="btn-amber justify-center">
                  Support Our Mission <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn-outline justify-center">
                  Send Us a Message <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}