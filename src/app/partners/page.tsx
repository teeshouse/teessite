import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getPartners, getSiteSettings } from "@/lib/sanity.fetch"
import { resolvePageLabels } from "@/lib/pageLabels"
import { ArrowRight, ExternalLink } from "lucide-react"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const labels = resolvePageLabels("partners", await getSiteSettings())
  return { title: labels.metaTitle, description: labels.metaDescription }
}

const TIER_LABELS: Record<string, string> = {
  platinum:  "Platinum Partners",
  gold:      "Gold Partners",
  silver:    "Silver Partners",
  community: "Community Partners"
}
const TIERS = ["platinum", "gold", "silver", "community"]

export default async function PartnersPage() {
  const [partners, settings] = await Promise.all([getPartners(), getSiteSettings()])
  const labels = resolvePageLabels("partners", settings)

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">{labels.pageKicker}</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">{labels.pageTitle}</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Our work is made possible by organizations and individuals who believe in our mission.
            </p>
          </div>
        </section>

        <section className="section-padding bg-green-light">
          <div className="container-max">
            {partners.length === 0 ? (
              <div className="card p-16 max-w-lg mx-auto text-center">
                <h2 className="text-green-dark mb-3">Partnership Opportunities</h2>
                <p className="text-gray-muted mb-6">Interested in partnering with Tee’s House? We would love to connect.</p>
                <Link href="/contact" className="btn-primary">Get in Touch <ArrowRight className="w-4 h-4" /></Link>
              </div>
            ) : (
              TIERS.map(tier => {
                const tierPartners = partners.filter((p: any) => p.tier === tier)
                if (tierPartners.length === 0) return null
                return (
                  <div key={tier} className="mb-16">
                    <h2 className="text-green-dark text-2xl mb-8 text-center">{TIER_LABELS[tier]}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {tierPartners.map((partner: any) => (
                        <div key={partner._id} className="card p-6 flex flex-col items-center text-center">
                          {partner.logo?.asset?.url ? (
                            <div className="relative h-20 w-full mb-4">
                              <Image src={partner.logo.asset.url} alt={partner.name} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-contain" />
                            </div>
                          ) : (
                            <div className="h-20 w-full flex items-center justify-center mb-4">
                              <span className="text-green-dark font-bold text-lg">{partner.name}</span>
                            </div>
                          )}
                          {partner.website && (
                            <a href={partner.website} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-amber flex items-center gap-1 hover:text-amber-dark">
                              Visit <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
            <div className="card p-10 text-center mt-8 bg-amber-light">
              <h2 className="text-green-dark mb-3">Become a Sponsor</h2>
              <p className="text-gray-muted max-w-lg mx-auto mb-6">
                Your organization can help us grow. From in-kind donations to program sponsorships,
                there are many ways to partner with Tee’s House.
              </p>
              <Link href="/contact" className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
