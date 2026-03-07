"use client"
import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Sprout, Package, Palette, CalendarDays, BookOpen, DollarSign, Megaphone, ClipboardList, CheckCircle, Loader2 } from "lucide-react"

const roles = [
  { Icon: Sprout,        title: "Gardening / Urban Farming",         desc: "Plant, maintain, and harvest fresh produce. Assist with composting, watering, and ensuring the gardens thrive." },
  { Icon: Package,       title: "Food Distribution",                  desc: "Sort, pack, and distribute fresh and non-perishable food items. Assist in organizing food drives and ensuring efficient delivery." },
  { Icon: Palette,       title: "Creative Arts",                      desc: "Lead or assist in art workshops focused on self-expression, healing, and community engagement â€” painting, music, storytelling, and more." },
  { Icon: CalendarDays,  title: "Event Support",                      desc: "Set up and run community events including farmers markets, art showcases, and fundraisers. Help with vendor coordination and logistics." },
  { Icon: BookOpen,      title: "Workshop Support & Education",       desc: "Share your expertise by teaching or assisting in workshops covering urban farming, wellness, entrepreneurship, or healthy living." },
  { Icon: DollarSign,    title: "Fundraising & Development",          desc: "Help secure financial support by assisting with grant writing, donor outreach, and fundraising events." },
  { Icon: Megaphone,     title: "Community Outreach & Ambassador",    desc: "Connect with schools, businesses, and partner organizations. Help recruit volunteers, promote events, and build lasting relationships." },
  { Icon: ClipboardList, title: "Administrative",                     desc: "Support day-to-day operations with data entry, file organization, volunteer scheduling, document preparation, and event logistics." }
]

const daysOfWeek   = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots    = ["Morning (8 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 7 PM)"]
const bgOptions    = ["Yes", "No", "I'd like to learn more before committing"]

type FormData = {
  name: string; email: string; phone: string
  roles: string[]; skills: string
  days: string[]; times: string[]
  backgroundCheck: string
  emergencyName: string; emergencyPhone: string; emergencyRelation: string
  notes: string
}

const empty: FormData = {
  name: "", email: "", phone: "",
  roles: [], skills: "",
  days: [], times: [],
  backgroundCheck: "",
  emergencyName: "", emergencyPhone: "", emergencyRelation: "",
  notes: ""
}

export default function VolunteerPage() {
  const [form, setForm]       = useState<FormData>(empty)
  const [status, setStatus]   = useState<"idle"|"loading"|"success"|"error">("idle")
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({})

  function set(key: keyof FormData, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: "" }))
  }

  function toggle(key: "roles"|"days"|"times", value: string) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value]
    }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim())           e.name = "Name is required"
    if (!form.email.trim())          e.email = "Email is required"
    if (!form.phone.trim())          e.phone = "Phone is required"
    if (!form.roles.length)          e.roles = "Select at least one role"
    if (!form.skills.trim())         e.skills = "Please share your background"
    if (!form.days.length)           e.days = "Select at least one day"
    if (!form.times.length)          e.times = "Select at least one time"
    if (!form.backgroundCheck)       e.backgroundCheck = "Please select an option"
    if (!form.emergencyName.trim())  e.emergencyName = "Emergency contact name is required"
    if (!form.emergencyPhone.trim()) e.emergencyPhone = "Emergency contact phone is required"
    if (!form.emergencyRelation.trim()) e.emergencyRelation = "Relationship is required"
    if (!form.notes.trim())          e.notes = "Please add a note"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setStatus("success")
      setForm(empty)
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <>
        <Navbar />
        <main className="section-padding bg-green-light min-h-[60vh] flex items-center">
          <div className="container-max text-center">
            <CheckCircle className="w-16 h-16 text-green-mid mx-auto mb-4" />
            <h2 className="text-green-dark mb-3">Thank You for Volunteering!</h2>
            <p className="text-gray-muted max-w-md mx-auto mb-6">
              We have received your interest form and will be in touch soon to match you with the perfect opportunity.
            </p>
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-green-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Be the Change</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Volunteer With Tees House</h1>
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
              {roles.map((r) => (
                <div key={r.title} className="card p-5">
                  <div className="inline-flex p-2 bg-green-light rounded-lg mb-3">
                    <r.Icon className="w-5 h-5 text-green-mid" />
                  </div>
                  <h3 className="text-green-dark text-sm font-semibold mb-2">{r.title}</h3>
                  <p className="text-gray-muted text-xs leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-muted text-sm mt-6 italic">
              Note: Volunteers working directly with youth may be required to pass a Level 2 background check prior to placement.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl">
            <div className="text-center mb-10">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Apply Now</span>
              <h2 className="text-green-dark mt-3">Volunteer Interest Form</h2>
              <p className="text-gray-muted mt-2">
                Complete the form below so we can learn more about your interests and get you plugged in.
              </p>
            </div>

            <div className="card p-8 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input className={`form-input ${errors.name ? "border-red-400" : ""}`}
                      placeholder="First and last name" value={form.name}
                      onChange={e => set("name", e.target.value)} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input className={`form-input ${errors.email ? "border-red-400" : ""}`}
                      type="email" placeholder="you@example.com" value={form.email}
                      onChange={e => set("email", e.target.value)} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input className={`form-input ${errors.phone ? "border-red-400" : ""}`}
                      type="tel" placeholder="850-000-0000" value={form.phone}
                      onChange={e => set("phone", e.target.value)} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div>
                <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Volunteer Interests *</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roles.map(r => (
                    <label key={r.title} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                      <input type="checkbox" className="w-4 h-4 accent-green-mid"
                        checked={form.roles.includes(r.title)}
                        onChange={() => toggle("roles", r.title)} />
                      <span className="text-sm text-gray-body">{r.title}</span>
                    </label>
                  ))}
                </div>
                {errors.roles && <p className="text-red-500 text-xs mt-1">{errors.roles}</p>}
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Background & Skills *</h3>
                <textarea className={`form-input min-h-[100px] ${errors.skills ? "border-red-400" : ""}`}
                  placeholder="Please share any relevant skills, certifications, or past volunteer experience."
                  value={form.skills} onChange={e => set("skills", e.target.value)} />
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Availability</h3>
                <p className="form-label mb-2">Days Available *</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {daysOfWeek.map(day => (
                    <button key={day} type="button"
                      onClick={() => toggle("days", day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2
                        ${form.days.includes(day)
                          ? "bg-green-dark text-white border-green-dark"
                          : "bg-white text-gray-muted border-gray-border hover:border-green-mid"}`}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
                {errors.days && <p className="text-red-500 text-xs mb-3">{errors.days}</p>}
                <p className="form-label mb-2">Preferred Times *</p>
                <div className="flex flex-col gap-2">
                  {timeSlots.map(t => (
                    <label key={t} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                      <input type="checkbox" className="w-4 h-4 accent-green-mid"
                        checked={form.times.includes(t)}
                        onChange={() => toggle("times", t)} />
                      <span className="text-sm text-gray-body">{t}</span>
                    </label>
                  ))}
                </div>
                {errors.times && <p className="text-red-500 text-xs mt-1">{errors.times}</p>}
              </div>

              {/* Background Check */}
              <div>
                <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Background Check *</h3>
                <p className="text-sm text-gray-muted mb-3">Are you willing to undergo a Level 2 background screening if required?</p>
                <div className="flex flex-col gap-2">
                  {bgOptions.map(o => (
                    <label key={o} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                      <input type="radio" name="bgCheck" className="w-4 h-4 accent-green-mid"
                        checked={form.backgroundCheck === o}
                        onChange={() => set("backgroundCheck", o)} />
                      <span className="text-sm text-gray-body">{o}</span>
                    </label>
                  ))}
                </div>
                {errors.backgroundCheck && <p className="text-red-500 text-xs mt-1">{errors.backgroundCheck}</p>}
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Name *</label>
                    <input className={`form-input ${errors.emergencyName ? "border-red-400" : ""}`}
                      placeholder="Full name" value={form.emergencyName}
                      onChange={e => set("emergencyName", e.target.value)} />
                    {errors.emergencyName && <p className="text-red-500 text-xs mt-1">{errors.emergencyName}</p>}
                  </div>
                  <div>
                    <label className="form-label">Phone *</label>
                    <input className={`form-input ${errors.emergencyPhone ? "border-red-400" : ""}`}
                      type="tel" placeholder="850-000-0000" value={form.emergencyPhone}
                      onChange={e => set("emergencyPhone", e.target.value)} />
                    {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone}</p>}
                  </div>
                  <div>
                    <label className="form-label">Relationship *</label>
                    <input className={`form-input ${errors.emergencyRelation ? "border-red-400" : ""}`}
                      placeholder="e.g. Spouse, Parent" value={form.emergencyRelation}
                      onChange={e => set("emergencyRelation", e.target.value)} />
                    {errors.emergencyRelation && <p className="text-red-500 text-xs mt-1">{errors.emergencyRelation}</p>}
                  </div>
                </div>
              </div>

              {/* Final Notes */}
              <div>
                <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Final Notes *</h3>
                <textarea className={`form-input min-h-[80px] ${errors.notes ? "border-red-400" : ""}`}
                  placeholder="Is there anything else you'd like us to know?"
                  value={form.notes} onChange={e => set("notes", e.target.value)} />
                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
              </div>

              {status === "error" && (
                <p className="text-red-500 text-sm text-center">
                  Something went wrong. Please email us directly at info@teeshouse.org
                </p>
              )}

              <button onClick={handleSubmit} disabled={status === "loading"}
                className="btn-amber w-full justify-center text-base py-4">
                {status === "loading"
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                  : "Submit Volunteer Interest Form"}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}