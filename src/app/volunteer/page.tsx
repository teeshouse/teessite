import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import VolunteerForm from "@/components/VolunteerForm"
import ApplyButton from "@/components/ApplyButton"
import {
  HELP_ME_FIND_A_FIT, kindSections, openOpportunities, formOpportunities,
  opportunityBadge, opportunityCompensation,
  type Opportunity, type FormOption,
} from "@/lib/opportunities"
import { Sprout, Palette, CalendarDays, GraduationCap, Briefcase } from "lucide-react"

const Icons: Record<string, typeof Sprout> = {
  "program-facilitator":           Palette,
  "field-maintenance-operator":    Sprout,
  "adopt-a-school-garden":         Sprout,
  "community-outreach-ambassador": CalendarDays,
}
const KindIcons = { internship: GraduationCap, paid: Briefcase, volunteer: Sprout }

export const metadata = {
  title: "Opportunities at Tee's House",
  description: "Explore internships, paid positions, and volunteer opportunities with Tee's House in Pensacola, FL.",
}

const BTN = "btn-primary text-sm py-2"

function OpportunityCard({ o }: { o: Opportunity }) {
  const Icon = Icons[o.id] || KindIcons[o.kind]
  const compensation = opportunityCompensation(o)

  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex p-2 bg-green-light rounded-lg">
          <Icon className="w-5 h-5 text-green-mid" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-amber">{opportunityBadge(o)}</span>
      </div>
      <h3 className="text-green-dark text-base font-semibold mb-2">{o.title}</h3>
      <p className="text-gray-muted text-sm leading-relaxed mb-4">{o.description}</p>
      <dl className="text-xs text-gray-body space-y-1 mb-4">
        {compensation && (
          <div><dt className="inline font-semibold">Compensation: </dt><dd className="inline">{compensation}</dd></div>
        )}
        {o.timeCommitment && (
          <div><dt className="inline font-semibold">Time commitment: </dt><dd className="inline">{o.timeCommitment}</dd></div>
        )}
      </dl>
      <p className="text-xs text-gray-muted italic mb-4">Level 2 background screening is required.</p>
      <div className="mt-auto pt-2">
        {o.apply.type === "form" && (
          <ApplyButton
            opportunityId={o.id}
            label={o.kind === "volunteer" ? "Express Interest" : "Apply"}
            className={BTN}
          />
        )}
        {o.apply.type === "handshake" && (
          <a href={o.apply.url} target="_blank" rel="noopener noreferrer" className={BTN}>Apply on Handshake</a>
        )}
        {o.apply.type === "getConnected" && (
          <a href={o.apply.url} target="_blank" rel="noopener noreferrer" className={BTN}>Sign Up on Get Connected</a>
        )}
      </div>
    </div>
  )
}

export default function VolunteerPage() {
  const open = openOpportunities()

  const formOptions: FormOption[] = [
    ...formOpportunities().map(o => ({ id: o.id, title: o.title, kind: o.kind })),
    { ...HELP_ME_FIND_A_FIT, kind: "general" },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero with photo */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image
            src="https://cdn.sanity.io/images/zbeb0ctt/production/c94746e3b73a04a0d2f0f69d628d5c00c2b85f3d-1024x1024.png"
            alt="Tee's House volunteers"
            fill sizes="100vw" className="object-cover" priority
          />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Be the Change</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Opportunities at Tee’s House</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto">
              Explore internships, paid positions, and volunteer opportunities. We welcome all with a sincere heart
              and a warm smile. Join our mission to empower, nourish, and build.
            </p>
            <nav aria-label="Opportunity categories" className="mt-8 flex flex-wrap justify-center gap-3">
              {kindSections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="btn-outline-white text-sm py-2">{s.heading}</a>
              ))}
            </nav>
          </div>
        </section>

        {/* Opportunities */}
        <section className="section-padding bg-green-light">
          <div className="container-max space-y-14">
            {kindSections.map(s => {
              const items = open.filter(o => o.kind === s.kind)
              return (
                <div key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-green-dark text-center mb-8">{s.heading}</h2>
                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map(o => <OpportunityCard key={o.id} o={o} />)}
                    </div>
                  ) : (
                    <p className="text-center text-gray-muted italic">{s.emptyMessage}</p>
                  )}
                </div>
              )
            })}
            <p className="text-center text-gray-muted text-sm">
              Not sure where you fit? Choose “{HELP_ME_FIND_A_FIT.title}” in the form below.
            </p>
          </div>
        </section>

        {/* Form (client component) */}
        <VolunteerForm options={formOptions} />
      </main>
      <Footer />
    </>
  )
}
