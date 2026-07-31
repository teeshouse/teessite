"use client"
import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"

const gradeLevels = ["Elementary School", "Middle School", "High School", "Recent Graduate"]
const interests = [
  "Gardening & Urban Farming", "Creative Arts", "Leadership Development",
  "Career Exploration", "Life Skills", "Nutrition & Wellness",
]
const lookingForOptions = [
  "Someone to talk to", "Skill-building", "Career guidance",
  "Creative mentorship", "Academic support",
]
const availabilityOptions = [
  "Weekday afternoons", "Weekday evenings", "Saturdays", "Sundays",
]

type FormData = {
  firstName: string; lastName: string; email: string; phone: string
  dateOfBirth: string
  gradeLevel: string
  interests: string[]; lookingFor: string[]; availability: string[]
  bio: string
  parentName: string; parentEmail: string
  agreedToTerms: boolean
  website: string // honeypot
}

const empty: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  dateOfBirth: "",
  gradeLevel: "",
  interests: [], lookingFor: [], availability: [],
  bio: "",
  parentName: "", parentEmail: "",
  agreedToTerms: false,
  website: "",
}

function computeAge(dob: string): number | null {
  if (!dob) return null
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const monthDiff = now.getMonth() - d.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d.getDate())) age--
  return age
}

export default function MentorshipApplyForm() {
  const [form, setForm] = useState<FormData>(empty)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const age = computeAge(form.dateOfBirth)
  const isMinor = age !== null && age < 18

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: "" }))
  }
  function toggle(key: "interests" | "lookingFor" | "availability", value: string) {
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
    if (!form.dateOfBirth) e.dateOfBirth = "Required"
    if (!form.interests.length) e.interests = "Select at least one"
    if (isMinor) {
      if (!form.parentName.trim()) e.parentName = "Required for applicants under 18"
      if (!form.parentEmail.trim()) e.parentEmail = "Required for applicants under 18"
    }
    if (!form.agreedToTerms) e.agreedToTerms = "You must agree to continue"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/mentorship/apply", {
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
            {isMinor
              ? "We've emailed your parent/guardian a consent link. Once they confirm, our team will follow up about pairing."
              : "Our team will review your application and follow up soon."}
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
          <h2 className="text-green-dark mt-3">Mentee Application</h2>
          <p className="text-gray-muted mt-2">
            Tell us about yourself so we can find the right mentor for you.
          </p>
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
                <label className="form-label">Phone</label>
                <input className="form-input" type="tel"
                  value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Date of Birth *</label>
                <input className={`form-input ${errors.dateOfBirth ? "border-red-400" : ""}`}
                  type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="form-label">Grade Level</label>
                <select className="form-input" value={form.gradeLevel}
                  onChange={e => set("gradeLevel", e.target.value)}>
                  <option value="">Select one</option>
                  {gradeLevels.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {isMinor && (
            <div className="bg-amber-light border-l-4 border-amber rounded-r-lg p-4">
              <h3 className="text-green-dark text-sm font-semibold mb-3">Parent / Guardian Information</h3>
              <p className="text-gray-muted text-xs mb-4">
                Since you're under 18, we'll need a parent or guardian's consent before you can be
                paired with a mentor. We'll email them a link to review and confirm.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Parent/Guardian Name *</label>
                  <input className={`form-input ${errors.parentName ? "border-red-400" : ""}`}
                    value={form.parentName} onChange={e => set("parentName", e.target.value)} />
                  {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                </div>
                <div>
                  <label className="form-label">Parent/Guardian Email *</label>
                  <input className={`form-input ${errors.parentEmail ? "border-red-400" : ""}`}
                    type="email" value={form.parentEmail} onChange={e => set("parentEmail", e.target.value)} />
                  {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">What are you interested in? *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {interests.map(i => (
                <label key={i} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-green-mid"
                    checked={form.interests.includes(i)} onChange={() => toggle("interests", i)} />
                  <span className="text-sm text-gray-body">{i}</span>
                </label>
              ))}
            </div>
            {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests}</p>}
          </div>

          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">What are you looking for in a mentor?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lookingForOptions.map(o => (
                <label key={o} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-green-mid"
                    checked={form.lookingFor.includes(o)} onChange={() => toggle("lookingFor", o)} />
                  <span className="text-sm text-gray-body">{o}</span>
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
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Tell Us About Yourself</h3>
            <textarea className="form-input min-h-[100px]"
              placeholder="What are your goals? What would you like to get out of this program?"
              value={form.bio} onChange={e => set("bio", e.target.value)} />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1 accent-green-mid"
                checked={form.agreedToTerms} onChange={e => set("agreedToTerms", e.target.checked)} />
              <span className="text-sm text-gray-body">
                I agree to participate respectfully in the Tee&rsquo;s House mentorship program and
                understand that all communication with my mentor happens through the program. *
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
