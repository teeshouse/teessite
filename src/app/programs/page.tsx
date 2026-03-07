import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowRight, Sprout, Mic2, FlaskConical, Apple, Rocket } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Programs | Tee's House Inc.",
  description: "Discover how Tee's House is cultivating creativity, education, and community growth."
}

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image
            src="https://www.teeshouse.org/wp-content/uploads/2025/11/agriculture-and-arts-2.jpg"
            alt="Tee's House programs"
            fill className="object-cover" priority
          />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Our Programs</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto leading-relaxed">
              At Tee&apos;s House, we believe growth begins with connection â€” between people, purpose, and the planet.
            </p>
          </div>
        </section>

        {/* Current Programs */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Active Now</span>
              <h2 className="text-green-dark mt-3">Current 2025 Programs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card overflow-hidden">
                <div className="relative h-56">
                  <Image
                    src="https://www.teeshouse.org/wp-content/uploads/2025/11/create-a-graphic-that-focuses-on-agriculture-and-arts-program-8-1024x1024.jpg"
                    alt="Agriculture and Arts Enrichment"
                    fill className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-light rounded-lg"><Sprout className="w-5 h-5 text-green-mid" /></div>
                    <span className="badge-current">Current 2025</span>
                  </div>
                  <h3 className="text-green-dark text-xl mb-3">Agriculture &amp; Arts Enrichment</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">
                    Our ongoing school partnerships continue to blossom. Through lessons in planting, painting, and creative
                    expression, students learn about sustainability, teamwork, and self-expression â€” all while strengthening
                    their connection to the environment and their community.
                  </p>
                </div>
              </div>
              <div className="card overflow-hidden">
                <div className="relative h-56">
                  <Image
                    src="https://www.teeshouse.org/wp-content/uploads/2025/11/ChatGPT-Image-Nov-4-2025-10_35_27-PM.png"
                    alt="Drama and Poetry Club"
                    fill className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-light rounded-lg"><Mic2 className="w-5 h-5 text-green-mid" /></div>
                    <span className="badge-current">Current 2025</span>
                  </div>
                  <h3 className="text-green-dark text-xl mb-3">Drama &amp; Poetry Club (Grades 3-5)</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">
                    Tee&apos;s House provides a safe, expressive space for students in grades 3-5 to explore their voices.
                    Participants study notable poets, create original pieces, and perform for peers and families â€”
                    building confidence and communication skills that extend far beyond the classroom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Teaser */}
        <section className="section-padding bg-amber">
          <div className="container-max text-center">
            <span className="badge-upcoming mb-4 inline-block">Coming 2026</span>
            <h2 className="text-white mb-4">Something Extraordinary Is Coming</h2>
            <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-lg">
              We are preparing a first-of-its-kind program launching in 2026 â€” merging educational enrichment
              with supportive workforce development practices that prepare youth not just for education, but for life.
            </p>
            <Link href="/contact" className="btn-outline-white mt-8 inline-flex">
              Stay Informed <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Past Programs */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Program History</span>
              <h2 className="text-green-dark mt-3">2025 Program Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card overflow-hidden">
                <div className="relative h-48">
                  <Image src="https://www.teeshouse.org/wp-content/uploads/2025/11/STEAM-Future-Leaders-791x1024.png"
                    alt="STEAM Future Leaders" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <span className="badge-past mb-3 inline-block">Past 2025</span>
                  <h3 className="text-green-dark text-lg mb-2">STEAM Future Leaders</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">
                    An innovative five-week experience blending science, technology, engineering, arts, and mathematics
                    through real-world learning for Northwest Florida youth.
                  </p>
                </div>
              </div>
              <div className="card overflow-hidden">
                <div className="relative h-48">
                  <Image src="https://www.teeshouse.org/wp-content/uploads/2025/11/2025-Sponsorship-Package-791x1024.png"
                    alt="Science Agriculture and Arts Week" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <span className="badge-past mb-3 inline-block">Past 2025</span>
                  <h3 className="text-green-dark text-lg mb-2">Science, Agriculture &amp; Arts Week</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">
                    An immersive learning journey connecting plant science, art inspired by nature, and
                    the relationship between growing food and nurturing imagination.
                  </p>
                </div>
              </div>
              <div className="card overflow-hidden">
                <div className="relative h-48">
                  <Image src="https://www.teeshouse.org/wp-content/uploads/2025/11/ChatGPT-Image-Nov-4-2025-10_31_21-PM.png"
                    alt="Nutrition Course" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <span className="badge-past mb-3 inline-block">Past 2025</span>
                  <h3 className="text-green-dark text-lg mb-2">Nutrition: Garden to Smoothie</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">
                    Students explored locally grown fruits and vegetables, then transformed ingredients
                    into vibrant, nutrient-rich smoothies â€” combining wellness with practical skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding-sm bg-green-dark text-white">
          <div className="container-max text-center px-4">
            <p className="font-display text-2xl italic text-green-light mb-6">
              Together, we can plant the ideas that will nourish generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/volunteer" className="btn-amber">Get Involved <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/donate"    className="btn-outline-white">Support Our Programs <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}