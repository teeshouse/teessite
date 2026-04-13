"use client"
import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Loader2, ArrowRight } from "lucide-react"

const INTEREST_OPTIONS = [
  "Youth Programs",
  "Agriculture & Gardening",
  "Arts & Creative Expression",
  "STEAM / Education",
  "Mental Health & Wellness",
  "Community Events",
  "Volunteer Opportunities",
  "Other",
]

const REFERRAL_OPTIONS = [
  "Social Media",
  "Friend or Family",
  "School / Teacher",
  "Community Organization",
  "Google Search",
  "Flyer / Event",
  "Other",
]

export default function IntakeForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dob: "",
    address: "", city: "", state: "", zip: "",
    interests: [] as string[],
    referralSource: "",
    goals: "", notes: "",
    website: "",
  })
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: "" }))
  }
  function toggleInterest(value: string) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(value)
        ? f.interests.filter(v => v !== value)
        : [...f.interests, value]
    }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())  e.name  = "Required"
    if (!form.email.trim()) e.email = "Required"
    if (!form.phone.trim()) e.phone = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <section className="section-padding bg-green-light min-h-[60vh] flex items-center">
        <div className="container-max text-center">
          <CheckCircle className="w-16 h-16 text-green-mid mx-auto mb-4" />
          <h2 className="text-green-dark mb-3">Thank You!</h2>
          <p className="text-gray-muted max-w-md mx-auto mb-6">
            We have received your intake form and will be in touch soon to
            discuss how we can best serve you.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-green-light">
      <div className="container-max max-w-2xl">
        <div className="card p-8 space-y-6">
          {/* Honeypot */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Website (leave blank)
              <input type="text" tabIndex={-1} autoComplete="off"
                value={form.website} onChange={e => set("website", e.target.value)} />
            </label>
          </div>

          {/* Personal Info */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.name ? "border-red-400" : ""}`}
                  placeholder="First and last name"
                  value={form.name} onChange={e => set("name", e.target.value)} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input className={`form-input ${errors.email ? "border-red-400" : ""}`}
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set("email", e.target.value)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="form-label">Phone *</label>
                <input className={`form-input ${errors.phone ? "border-red-400" : ""}`}
                  type="tel" placeholder="850-000-0000"
                  value={form.phone} onChange={e => set("phone", e.target.value)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date"
                  value={form.dob} onChange={e => set("dob", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">
              Address <span className="text-gray-muted text-sm font-normal">(optional)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="form-label">Street Address</label>
                <input className="form-input" placeholder="123 Main St"
                  value={form.address} onChange={e => set("address", e.target.value)} />
              </div>
              <div>
                <label className="form-label">City</label>
                <input className="form-input" placeholder="Pensacola"
                  value={form.city} onChange={e => set("city", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">State</label>
                  <input className="form-input" placeholder="FL"
                    value={form.state} onChange={e => set("state", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">ZIP</label>
                  <input className="form-input" placeholder="32507"
                    value={form.zip} onChange={e => set("zip", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">
              Interests
            </h3>
            <p className="text-gray-muted text-sm mb-3">
              Select all that apply so we can connect you with the right programs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-gray-body text-sm">
                  <input type="checkbox" className="accent-green-mid w-4 h-4"
                    checked={form.interests.includes(opt)}
                    onChange={() => toggleInterest(opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Referral */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">
              How Did You Hear About Us?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REFERRAL_OPTIONS.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-gray-body text-sm">
                  <input type="radio" name="referral" className="accent-green-mid w-4 h-4"
                    checked={form.referralSource === opt}
                    onChange={() => set("referralSource", opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Goals and Notes */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">
              Goals & Additional Info
            </h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">
                  What are you hoping to gain from our programs?
                </label>
                <textarea className="form-input min-h-[100px]"
                  placeholder="Tell us about your goals..."
                  value={form.goals} onChange={e => set("goals", e.target.value)} />
              </div>
              <div>
                <label className="form-label">
                  Anything else we should know?
                </label>
                <textarea className="form-input min-h-[80px]"
                  placeholder="Allergies, accessibility needs, questions..."
                  value={form.notes} onChange={e => set("notes", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Submit */}
          {status === "error" && (
            <p className="text-red-500 text-sm">
              Something went wrong. Please try again or email us at{" "}
              <a href="mailto:info@teeshouse.org" className="underline">info@teeshouse.org</a>.
            </p>
          )}
          <button onClick={handleSubmit} disabled={status === "loading"}
            className="btn-primary w-full justify-center text-base py-4">
            {status === "loading"
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              : "Submit Intake Form"}
          </button>
        </div>
      </div>
    </section>
  )
}
