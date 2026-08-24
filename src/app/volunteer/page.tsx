import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import VolunteerForm from "@/components/VolunteerForm"
import { roles } from "@/lib/volunteerRoles"
import { Sprout, Package, Palette, CalendarDays } from "lucide-react"

const Icons: Record<string, typeof Sprout> = {
  "Field Maintenance Gardener":    Sprout,
  "Field Distribution Support":    Package,
  "Workshop Facilitator":          Palette,
  "Community Outreach Ambassador": CalendarDays,
}

export const metadata = {
  title: "Volunteer | Tee's House",
  description: "Join the Tee's House volunteer team and make a difference in your community.",
}

export default function VolunteerPage() {
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
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Volunteer With Tee's House</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto">
              We welcome all with a sincere heart and a warm smile. Join our mission to empower, nourish, and build.
            </p>
          </div>
        </section>

        {/* Roles */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-10">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Opportunities</span>
              <h2 className="text-green-dark mt-3">Volunteer Roles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {roles.map((r) => {
                const Icon = Icons[r.title] || Sprout
                return (
                  <div key={r.title} className="card p-5">
                    <div className="inline-flex p-2 bg-green-light rounded-lg mb-3">
                      <Icon className="w-5 h-5 text-green-mid" />
                    </div>
                    <h3 className="text-green-dark text-sm font-semibold mb-2">{r.title}</h3>
                    <p className="text-gray-muted text-xs leading-relaxed">{r.desc}</p>
                  </div>
                )
              })}
            </div>
            <p className="text-center text-gray-muted text-sm mt-6 italic">
              Note: Volunteers working directly with youth may be required to pass a Level 2 background check.
            </p>
          </div>
        </section>

        {/* Form (client component) */}
        <VolunteerForm />
      </main>
      <Footer />
    </>
  )
}
