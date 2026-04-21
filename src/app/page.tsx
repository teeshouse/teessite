import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AnimatedCounter from "@/components/AnimatedCounter"
import ImpactCalculator from "@/components/ImpactCalculator"
import VideoHero from "@/components/VideoHero"
import ParallaxSection from "@/components/ParallaxSection"
import BeforeAfterSlider from "@/components/BeforeAfterSlider"
import { getSiteSettings, getImpactStats, getFeaturedPrograms } from "@/lib/sanity.fetch"
import { resolveProgramsLabels } from "@/lib/programsPageLabels"
import type { SiteSettings } from "@/types"
import { ArrowRight, Heart, Users, Mail, Phone, MapPin } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tee’s House Inc. | Growing Community in Pensacola, FL",
  description: "Tee’s House Inc. is a 501(c)(3) nonprofit cultivating youth development through agriculture, arts, and education in Pensacola, Florida.",
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

const FALLBACK = {
  heroHeadline:   "Growing Community Through Agriculture, Arts and Education",
  heroSubtext:    "Tee’s House Inc. is a 501(c)(3) nonprofit cultivating youth development through hands-on learning experiences in Pensacola, Florida.",
  missionTagline: "Planting seeds of knowledge, creativity, and community.",
  phone:          "850.291.1888",
  email:          "info@teeshouse.org",
  address:        "Pensacola, FL",
}

const FALLBACK_STATS = [
  { label: "Youth Served",       value: "150+" },
  { label: "Programs Delivered", value: "12"   },
  { label: "Volunteers",         value: "40+"  },
  { label: "Years of Impact",    value: "2+"   },
]

export default async function HomePage() {
  const [settings, stats, programs] = await Promise.all([
    getSiteSettings(),
    getImpactStats(),
    getFeaturedPrograms()
  ])

  const s: Partial<SiteSettings> = settings || FALLBACK
  const iStats = stats?.length > 0 ? stats : FALLBACK_STATS
  const programsLabels = resolveProgramsLabels(settings)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero (Phase 7B: video with image fallback) */}
        <VideoHero
          videoSrc={s.heroVideoUrl || undefined}
          posterSrc={s.homePage?.heroImage?.asset?.url || `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`}
          posterAlt="Tee’s House hero"
        >
          <span className="text-amber font-semibold text-sm uppercase tracking-widest">Pensacola, Florida</span>
          <h1 className="text-white mt-4 mb-6 text-4xl md:text-6xl leading-tight max-w-4xl mx-auto">
            {s.heroHeadline}
          </h1>
          <p className="text-green-light text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {s.heroSubtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community-impact" className="btn-amber">
              {programsLabels.homeHeroCta} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/donate" className="btn-outline-white">
              Support Our Mission <Heart className="w-4 h-4" />
            </Link>
          </div>
        </VideoHero>

        {/* Mission */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Mission</span>
            <p className="font-display italic text-green-dark text-2xl md:text-3xl leading-relaxed mt-4">
              {s.missionTagline}
            </p>
          </div>
        </section>

        {/* Animated Impact Stats */}
        <section className="section-padding bg-green-dark">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Impact</span>
              <h2 className="text-white mt-3">Making a Difference</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {iStats.map((stat: any, i: number) => (
                <AnimatedCounter key={i} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        {programs?.length > 0 && (
          <section className="section-padding bg-green-light">
            <div className="container-max">
              <div className="text-center mb-12">
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">What We Do</span>
                <h2 className="text-green-dark mt-3">Featured Programs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {programs.slice(0, 3).map((p: any) => (
                  <div key={p._id} className="card overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={p.image?.asset?.url || `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`}
                        alt={p.title} fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-green-dark text-lg mb-2">{p.title}</h3>
                      <Link href="/community-impact" className="inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-dark transition-colors">
                        Learn More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/community-impact" className="btn-primary">
                  {programsLabels.homeListCta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Parallax — now Sanity-editable */}
        <ParallaxSection
          imageSrc={s.homePage?.parallaxImage?.asset?.url || `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`}
          imageAlt="Tee’s House garden"
          speed={0.35}
          minHeight="55vh"
          overlayClassName="bg-green-dark/70"
        >
          <span className="text-amber font-semibold text-sm uppercase tracking-widest">Rooted in Pensacola</span>
          <h2 className="text-white mt-3 max-w-3xl mx-auto">
            {s.homePage?.parallaxHeading || "Cultivating the next generation, one season at a time."}
          </h2>
          <p className="text-green-light mt-4 max-w-2xl mx-auto">
            {s.homePage?.parallaxText || "From seed to harvest, from sketchbook to stage \u2014 we grow young leaders who invest in the community that raised them."}
          </p>
        </ParallaxSection>

        {/* Phase 7B: Before / After transformation slider (Sanity-driven with fallback) */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-10">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">See the Growth</span>
              <h2 className="text-green-dark mt-3">Before &amp; After</h2>
              <p className="text-green-dark/70 mt-3 max-w-2xl mx-auto">
                {s.beforeAfter?.caption || "Drag the slider to see how our garden transforms across a single growing season."}
              </p>
            </div>
            <BeforeAfterSlider
              beforeSrc={s.beforeAfter?.beforeImage?.asset?.url || `${CDN}/d849d6072cf5ef6e1b989b58751d39a5c9db6429-791x1024.png`}
              afterSrc={s.beforeAfter?.afterImage?.asset?.url   || `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`}
              beforeAlt={`Garden ${s.beforeAfter?.beforeLabel || "before"}`}
              afterAlt={`Garden ${s.beforeAfter?.afterLabel || "after"}`}
              beforeLabel={s.beforeAfter?.beforeLabel || "Before"}
              afterLabel={s.beforeAfter?.afterLabel || "After"}
            />
          </div>
        </section>

        {/* Mini Impact Calculator on homepage */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-10">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Give With Purpose</span>
              <h2 className="text-green-dark mt-3">See What Your Gift Does</h2>
            </div>
            <ImpactCalculator />
          </div>
        </section>

        {/* CTA — now Sanity-editable */}
        <section className="section-padding bg-amber">
          <div className="container-max text-center">
            <h2 className="text-white mb-4">{s.homePage?.ctaHeading || "Ready to Make a Difference?"}</h2>
            <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
              {s.homePage?.ctaText || "Whether you donate, volunteer, or spread the word, every action helps us grow."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate"    className="btn-outline-white">Donate Now <Heart className="w-4 h-4" /></Link>
              <Link href="/volunteer" className="btn-outline-white">Volunteer <Users className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>

        {/* Contact strip */}
        <section className="py-10 bg-green-dark">
          <div className="container-max">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-green-light">
              <a href="tel:8502911888" className="flex items-center gap-2 hover:text-amber transition-colors">
                <Phone className="w-4 h-4 text-amber" />{s.phone || "850.291.1888"}
              </a>
              <a href="mailto:info@teeshouse.org" className="flex items-center gap-2 hover:text-amber transition-colors">
                <Mail className="w-4 h-4 text-amber" />{s.email || "info@teeshouse.org"}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber shrink-0" />{s.address || "Pensacola, FL"}
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}