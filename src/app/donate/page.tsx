import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ImpactCalculator from "@/components/ImpactCalculator"
import DonationThermometer from "@/components/DonationThermometer"
import DonorWall from "@/components/DonorWall"
import { getSiteSettings } from "@/lib/sanity.fetch"
import type { SiteSettings } from "@/types"
import { Heart, Mail, Smartphone, CreditCard, ArrowRight, Shield, RefreshCw } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Donate | Tee's House Inc.",
  description: "Support Tee's House Inc. Your donation helps us provide agriculture, arts, and STEAM programs to youth in Pensacola, FL."
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

const FALLBACK_GIVING = [
  { title: "PayPal",        description: "Secure one-time or recurring donation", buttonLabel: "Donate via PayPal", url: "https://www.paypal.com/donate/?hosted_button_id=XSHDRCQ2L66JW", isExternal: true },
  { title: "Venmo",         description: "@TeesHouseInc",                         buttonLabel: "Open Venmo",        url: "https://venmo.com/TeesHouseInc",  isExternal: true },
  { title: "Cash App",      description: "$teeshouseinc",                         buttonLabel: "Open Cash App",     url: "https://cash.app/$teeshouseinc",  isExternal: true },
  { title: "Check by Mail", description: "Payable to Tee's House Inc.",           buttonLabel: "Get Mailing Address", url: "/contact",                      isExternal: false },
]

const FALLBACK_TIERS = [
  { amount: "$10/mo", impact: "provides snacks for 2 students every week" },
  { amount: "$25/mo", impact: "covers art supplies for an entire class monthly" },
  { amount: "$50/mo", impact: "sponsors one student through a full program" },
]

const ICON_MAP: Record<string, any> = {
  "PayPal": <CreditCard className="w-6 h-6 text-amber" />,
  "Venmo": <Smartphone className="w-6 h-6 text-amber" />,
  "Cash App": <Smartphone className="w-6 h-6 text-amber" />,
  "Check by Mail": <Mail className="w-6 h-6 text-amber" />,
}

export default async function DonatePage() {
  const settings = await getSiteSettings()
  const s: Partial<SiteSettings> = settings || {}
  const d = s.donatePage || {}

  const goal     = d.fundraisingGoal     ?? 25000
  const raised   = d.fundraisingRaised   ?? 6200
  const donors   = d.fundraisingDonors   ?? 62
  const label    = d.fundraisingLabel    ?? "2026 STEAM Future Leaders Fund"
  const deadline = d.fundraisingDeadline ?? "August 31, 2026"
  const giving   = d.givingOptions?.length ? d.givingOptions : FALLBACK_GIVING
  const tiers    = d.monthlyTiers?.length  ? d.monthlyTiers  : FALLBACK_TIERS
  const paypalUrl = s.paypalDonateLink || "https://www.paypal.com/donate/?hosted_button_id=XSHDRCQ2L66JW"

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image
            src={`${CDN}/58792471f8a4433f2d4367eba2366f9dd5f21914-1024x1024.png`}
            alt="Support Tee's House" fill sizes="100vw" className="object-cover" priority
          />
          <div className="absolute inset-0 bg-green-dark/80" />
          <div className="container-max relative z-10 text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Make a Difference</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Support Our Mission</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto leading-relaxed">
              Every dollar you give plants a seed of opportunity for a young person in Pensacola.
              Your generosity makes our programs possible.
            </p>
          </div>
        </section>

        {/* Impact Calculator */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <ImpactCalculator />
          </div>
        </section>

        {/* Fundraising Thermometer — now Sanity-driven */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <DonationThermometer
              goal={goal}
              raised={raised}
              donors={donors}
              label={label}
              deadline={deadline}
            />
          </div>
        </section>

        {/* Other ways to give — now Sanity-driven */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Giving Options</span>
              <h2 className="text-green-dark mt-3">Other Ways to Give</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {giving.map((item: any) => (
                <div key={item.title} className="card p-6 text-center flex flex-col">
                  <div className="w-12 h-12 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-3">
                    {ICON_MAP[item.title] || <CreditCard className="w-6 h-6 text-amber" />}
                  </div>
                  <h3 className="text-green-dark font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-muted text-sm mb-4 flex-1">{item.description}</p>
                  {item.isExternal ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="btn-outline text-sm justify-center">
                      {item.buttonLabel || "Donate"} <ArrowRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link href={item.url || "/contact"} className="btn-outline text-sm justify-center">
                      {item.buttonLabel || "Donate"} <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly giving — now Sanity-driven tiers */}
        <section className="section-padding bg-green-dark">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Sustaining Support</span>
                <h2 className="text-white mt-3 mb-4">Become a Monthly Donor</h2>
                <p className="text-green-light leading-relaxed mb-4">
                  Monthly donors are the backbone of our programs. A recurring gift -- no matter the size --
                  allows us to plan ahead, hire instructors, and serve more youth consistently.
                </p>
                <div className="flex flex-col gap-3 mb-6">
                  {tiers.map((item: any) => (
                    <div key={item.amount} className="flex items-start gap-3">
                      <RefreshCw className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                      <p className="text-green-light text-sm"><span className="font-bold text-white">{item.amount}</span> {item.impact}</p>
                    </div>
                  ))}
                </div>
                <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="btn-amber inline-flex">
                  <RefreshCw className="w-4 h-4" /> Set Up Monthly Giving
                </a>
              </div>
              <div className="relative h-72 rounded-card overflow-hidden shadow-card-hover">
                <Image
                  src={`${CDN}/58792471f8a4433f2d4367eba2366f9dd5f21914-1024x1024.png`}
                  alt="Monthly giving" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="container-max">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              {[
                { icon: <Shield className="w-6 h-6 text-green-mid" />, text: "501(c)(3) Registered Nonprofit" },
                { icon: <Shield className="w-6 h-6 text-green-mid" />, text: "Secure Payment Processing" },
                { icon: <Heart className="w-6 h-6 text-green-mid" />,  text: "100% Goes to Programs" },
                { icon: <Shield className="w-6 h-6 text-green-mid" />, text: "Tax-Deductible Donations" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 text-gray-muted text-sm">
                  {item.icon}<span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donor Wall */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <DonorWall />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
