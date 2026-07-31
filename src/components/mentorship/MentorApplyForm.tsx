"use client"
import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"

const expertiseAreas = [
  "Gardening & Urban Farming", "Creative Arts", "Leadership Development",
  "Career Exploration", "Life Skills", "Nutrition & Wellness",
]
const mentoringStyles = [
  "One-on-one conversations", "Hands-on activities", "Structured lessons", "Casual check-ins",
]
const availabilityOptions = [
  "Weekday afternoons", "Weekday evenings", "Saturdays", "Sundays",
]

type FormData = {
  firstName: string; lastName: string; email: string; phone: string
  company: string; jobTitle: string; location: string
  bio: string
  expertise: string[]; mentoringStyle: string[]; availability: string[]
  agreedToTerms: boolean
  backgroundSelfCert: boolean
  website: string // honeypot
}

const empty: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  company: "", jobTitle: "", location: "",
  bio: "",
  expertise: [], mentoringStyle: [], availability: [],
  agreedToTerms: false,
  backgroundSelfCert: false,
  website: "",
}

export default function MentorApplyForm() {
  const [form, setForm] = useState<FormData>(empty)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: "" }))
  }
  function toggle(key: "expertise" | "mentoringStyle" | "availability", value: string) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value],
    }))
  }

  function validate() {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim()) e.lastName = "Required"
    if (!form.email.trim()) e.email = "Required"
    if (!form.phone.trim()) e.phone = "Required"
    if (!form.expertise.length) e.expertise = "Select at least one"
    if (!form.bio.trim()) e.bio = "Required"
    if (!form.backgroundSelfCert) e.backgroundSelfCert = "Required to apply"
    if (!form.agreedToTerms) e.agreedToTerms = "You must agree to continue"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/mentorship/apply-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <section className="section-padding bg-green-light min-h-[60vh] flex items-center">
        <div className="container-max text-center">
          <CheckCircle className="w-16 h-16 text-green-mid mx-auto mb-4" />
          <h2 className="text-green-dark mb-3">Application Received!</h2>
          <p className="text-gray-muted max-w-md mx-auto mb-6">
            Thank you for applying to mentor. Our team will review your application and follow up soon.
          </p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-amber font-semibold text-sm uppercase tracking-widest">Apply Now</span>
          <h2 className="text-green-dark mt-3">Mentor Application</h2>
          <p className="text-gray-muted mt-2">Share your background so we can pair you with the right mentee.</p>
        </div>
        <div className="card p-8 space-y-6">
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Website (leave blank)
              <input type="text" tabIndex={-1} autoComplete="off"
                value={form.website} onChange={e => set("website", e.target.value)} />
            </label>
          </div>

          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">First Name *</label>
                <input className={`form-input ${errors.firstName ? "border-red-400" : ""}`}
                  value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input className={`form-input ${errors.lastName ? "border-red-400" : ""}`}
                  value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input className={`form-input ${errors.email ? "border-red-400" : ""}`}
                  type="email" value={form.email} onChange={e => set("email", e.target.value)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="form-label">Phone *</label>
                <input className={`form-input ${errors.phone ? "border-red-400" : ""}`}
                  type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="form-label">Employer / Company</label>
                <input className="form-input" value={form.company} onChange={e => set("company", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Job Title</label>
                <input className="form-input" value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Pensacola, FL"
                  value={form.location} onChange={e => set("location", e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">What can you mentor in? *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {expertiseAreas.map(a => (
                <label key={a} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-green-mid"
                    checked={form.expertise.includes(a)} onChange={() => toggle("expertise", a)} />
                  <span className="text-sm text-gray-body">{a}</span>
                </label>
              ))}
            </div>
            {errors.expertise && <p className="text-red-500 text-xs mt-1">{errors.expertise}</p>}
          </div>

          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Mentoring Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mentoringStyles.map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-green-mid"
                    checked={form.mentoringStyle.includes(s)} onChange={() => toggle("mentoringStyle", s)} />
                  <span className="text-sm text-gray-body">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map(a => (
                <button key={a} type="button" onClick={() => toggle("availability", a)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2
                    ${form.availability.includes(a) ? "bg-green-dark text-white border-green-dark" : "bg-white text-gray-muted border-gray-border hover:border-green-mid"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Tell Us About Yourself *</h3>
            <textarea className={`form-input min-h-[100px] ${errors.bio ? "border-red-400" : ""}`}
              placeholder="Why do you want to mentor with Tee's House?"
              value={form.bio} onChange={e => set("bio", e.target.value)} />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
          </div>

          <div className="bg-amber-light border-l-4 border-amber rounded-r-lg p-4 space-y-3">
            <h3 className="text-green-dark text-sm font-semibold">Background & Safety</h3>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1 accent-green-mid"
                checked={form.backgroundSelfCert} onChange={e => set("backgroundSelfCert", e.target.checked)} />
              <span className="text-sm text-gray-body">
                I certify that I have no criminal convictions involving violence, fraud, sexual
                misconduct, or crimes against minors, and I understand Tee&rsquo;s House may
                request additional background verification before I&rsquo;m paired with a mentee. *
              </span>
            </label>
            {errors.backgroundSelfCert && <p className="text-red-500 text-xs mt-1">{errors.backgroundSelfCert}</p>}
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1 accent-green-mid"
                checked={form.agreedToTerms} onChange={e => set("agreedToTerms", e.target.checked)} />
              <span className="text-sm text-gray-body">
                I agree to participate respectfully in the Tee&rsquo;s House mentorship program, many
                of whose mentees are minors, and to communicate only through the program. *
              </span>
            </label>
            {errors.agreedToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreedToTerms}</p>}
          </div>

          {status === "error" && (
            <p className="text-red-500 text-sm text-center">
              Something went wrong. Please email us at info@teeshouse.org
            </p>
          )}
          <button onClick={handleSubmit} disabled={status === "loading"}
            className="btn-amber w-full justify-center text-base py-4">
            {status === "loading"
              ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
              : "Submit Application"}
          </button>
        </div>
      </div>
    </section>
  )
}
