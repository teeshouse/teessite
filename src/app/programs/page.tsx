import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowRight, Mail, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Programs | Tee's House Inc.",
  description: "Discover how Tee's House is cultivating creativity, education, and community growth through agriculture, arts, and STEAM programs."
}

const WP = "https://www.teeshouse.org/wp-content/uploads/2025/11"

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image src={`${WP}/agriculture-and-arts-2.jpg`}
            alt="Tee's House programs" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Our Programs</h1>
          </div>
        </section>

        {/* Intro */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl text-center">
            <p className="font-display italic text-green-dark text-xl md:text-2xl leading-relaxed">
              At Tee&apos;s House, we believe growth begins with connection â€” between people, purpose, and the planet.
              Each program we create is designed to nourish the mind, the body, and the spirit while building stronger,
              more resilient communities. Our work in 2025 reflects the heart of that mission, weaving together science,
              creativity, agriculture, and the arts to help young leaders blossom.
            </p>
          </div>
        </section>

        {/* Current 2025 Programs */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Active Now</span>
              <h2 className="text-green-dark mt-3">Current 2025 Programs</h2>
            </div>

            {/* Agriculture & Arts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
              <div className="relative h-96 rounded-card overflow-hidden shadow-card-hover">
                <Image src={`${WP}/Untitled-design-3-791x1024.png`}
                  alt="Agriculture and Arts Enrichment" fill className="object-cover" />
              </div>
              <div>
                <span className="badge-current mb-4 inline-block">Current 2025</span>
                <h3 className="text-green-dark text-2xl mb-4">Agriculture &amp; Arts Enrichment</h3>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Our ongoing school partnerships continue to blossom. Tee&apos;s House has been actively involved
                  in implementing agriculture &amp; arts enrichment that enhances traditional learning with creative,
                  hands-on experiences.
                </p>
                <p className="text-gray-muted leading-relaxed">
                  Through lessons in planting, painting, and creative expression, students learn about sustainability,
                  teamwork, and self-expression â€” all while strengthening their connection to the environment
                  and their community.
                </p>
              </div>
            </div>

            {/* Drama & Poetry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
              <div className="md:order-2 relative h-96 rounded-card overflow-hidden shadow-card-hover">
                <Image src={`${WP}/ChatGPT-Image-Nov-4-2025-10_35_27-PM.png`}
                  alt="Drama and Poetry Club" fill className="object-cover" />
              </div>
              <div className="md:order-1">
                <span className="badge-current mb-4 inline-block">Current 2025</span>
                <h3 className="text-green-dark text-2xl mb-4">Drama &amp; Poetry Club (Grades 3â€“5)</h3>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Through our Drama and Poetry Club, Tee&apos;s House provides a safe, expressive space for students
                  in grades 3â€“5 to explore their voices and share their stories.
                </p>
                <p className="text-gray-muted leading-relaxed">
                  Participants study the works of notable poets, create original pieces, and perform for peers
                  and families, building confidence and communication skills that extend far beyond the classroom.
                  Each performance becomes a celebration of creativity, resilience, and cultural pride.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Teaser */}
        <section className="section-padding bg-amber overflow-hidden">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="badge-upcoming mb-4 inline-block">Coming 2026</span>
                <h2 className="text-white mb-4">Looking Ahead to 2026</h2>
                <p className="text-white/90 leading-relaxed mb-4">
                  As we reflect on an incredible year of growth, we&apos;re also preparing something extraordinary â€”
                  a first-of-its-kind program launching in 2026.
                </p>
                <p className="text-white/90 leading-relaxed mb-6">
                  This initiative will expand our vision by merging educational enrichment with supportive workforce
                  development practices that prepare youth not just for education, but for life. While the full name
                  and details remain under wraps, one thing is certain: this next chapter will inspire transformation,
                  innovation, and purpose at every level.
                </p>
                <Link href="/contact" className="btn-outline-white inline-flex">
                  Stay Informed <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative h-80 rounded-card overflow-hidden shadow-card-hover">
                <Image src={`${WP}/ChatGPT-Image-Nov-4-2025-10_16_52-PM.png`}
                  alt="2026 program preview" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Previous 2025 Program Highlights */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Program History</span>
              <h2 className="text-green-dark mt-3">Previous 2025 Program Highlights</h2>
            </div>

            {/* STEAM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
              <div className="relative h-96 rounded-card overflow-hidden shadow-card-hover">
                <Image src={`${WP}/STEAM-Future-Leaders-791x1024.png`}
                  alt="STEAM Future Leaders" fill className="object-cover" />
              </div>
              <div>
                <span className="badge-past mb-4 inline-block">Past 2025</span>
                <h3 className="text-green-dark text-2xl mb-4">STEAM Future Leaders of Northwest Florida</h3>
                <p className="text-xs text-amber font-semibold uppercase tracking-widest mb-3">Summer Cohort 2025</p>
                <p className="text-gray-muted leading-relaxed mb-4">
                  This year marked a major milestone as Tee&apos;s House spearheaded the creation of the STEAM Future
                  Leaders of NWFL 2025 Cohort, an innovative five-week experience that blended science, technology,
                  engineering, arts, and mathematics through real-world learning.
                </p>
                <p className="text-gray-muted leading-relaxed">
                  Throughout the program, youth explored hands-on discovery in a way that connected education to everyday
                  life. Participants cultivated curiosity, leadership, and teamwork â€” building the confidence to see
                  themselves as future innovators and community changemakers.
                </p>
              </div>
            </div>

            {/* Science Agriculture Arts Week */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
              <div className="md:order-2 relative h-96 rounded-card overflow-hidden shadow-card-hover">
                <Image src={`${WP}/2025-Sponsorship-Package-791x1024.png`}
                  alt="Science Agriculture and Arts Week" fill className="object-cover" />
              </div>
              <div className="md:order-1">
                <span className="badge-past mb-4 inline-block">Past 2025</span>
                <h3 className="text-green-dark text-2xl mb-4">Science, Agriculture, and Arts Week</h3>
                <p className="text-gray-muted leading-relaxed mb-4">
                  As part of the STEAM initiative, Tee&apos;s House proudly facilitated the Science, Agriculture, and
                  Arts Week, an immersive learning journey where participants explored how creativity and cultivation
                  intertwine.
                </p>
                <p className="text-gray-muted leading-relaxed">
                  Students examined plant science, created art inspired by nature, and learned how growing food can
                  nurture both the body and the imagination. The week showcased the true meaning of holistic learning â€”
                  connecting science to soil, art to agriculture, and curiosity to community.
                </p>
              </div>
            </div>

            {/* Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="relative h-96 rounded-card overflow-hidden shadow-card-hover">
                <Image src={`${WP}/ChatGPT-Image-Nov-4-2025-10_31_21-PM.png`}
                  alt="Nutrition Course Garden to Smoothie" fill className="object-cover" />
              </div>
              <div>
                <span className="badge-past mb-4 inline-block">Past 2025</span>
                <h3 className="text-green-dark text-2xl mb-4">Nutrition Course: From Garden to Smoothie</h3>
                <p className="text-gray-muted leading-relaxed mb-4">
                  In 2025, Tee&apos;s House hosted an engaging nutrition course that taught students about healthy eating
                  and homegrown ingredients. Participants explored fruits and vegetables that can be grown locally,
                  then transformed those ingredients into vibrant, nutrient-rich smoothies.
                </p>
                <p className="text-gray-muted leading-relaxed">
                  The course combined wellness education with practical skills, reminding everyone that nourishment
                  can be both simple and joyful when it begins with the earth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing quote + contact */}
        <section className="section-padding bg-green-dark text-white overflow-hidden">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="font-display italic text-2xl md:text-3xl text-green-light leading-relaxed mb-8">
                  Together, we can plant the ideas that will nourish generations to come.
                </p>
                <div className="flex flex-col gap-3">
                  <a href="mailto:info@teeshouse.org"
                    className="flex items-center gap-3 text-green-light hover:text-amber transition-colors">
                    <Mail className="w-5 h-5 text-amber shrink-0" />info@teeshouse.org
                  </a>
                  <a href="tel:8502911888"
                    className="flex items-center gap-3 text-green-light hover:text-amber transition-colors">
                    <Phone className="w-5 h-5 text-amber shrink-0" />850.291.1888
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href="/volunteer" className="btn-amber">Get Involved <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/donate"    className="btn-outline-white">Support Our Programs <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
              <div className="relative h-72 rounded-card overflow-hidden shadow-card-hover">
                <Image src={`${WP}/ChatGPT-Image-Nov-3-2025-07_20_14-AM-1.png`}
                  alt="Tee's House community" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}