"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import {
  OPPORTUNITY_SELECT_EVENT, daysOfWeek, timeSlots, bgOptions, creditOptions, educationOptions,
  kindSections, RESUME_MAX_BYTES, RESUME_EXTENSIONS, type FormOption,
} from "@/lib/opportunities"

type FormData = {
  opportunityId: string; otherRoles: string
  name: string; email: string; phone: string
  days: string[]; times: string[]
  statement: string
  education: string; academicCredit: string
  backgroundCheck: string
  notes: string
  website: string
}

const empty: FormData = {
  opportunityId:"",otherRoles:"",name:"",email:"",phone:"",days:[],times:[],statement:"",
  education:"",academicCredit:"",backgroundCheck:"",notes:"",website:""
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function VolunteerForm({ options }: { options: FormOption[] }) {
  const [form, setForm]       = useState<FormData>(empty)
  const [status, setStatus]   = useState<"idle"|"loading"|"success"|"error">("idle")
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData,string>>>({})
  const [serverError, setServerError] = useState("")
  const [submittedTitle, setSubmittedTitle] = useState("")
  const [resume, setResume]   = useState<File | null>(null)
  const [resumeError, setResumeError] = useState("")
  const resumeInput = useRef<HTMLInputElement>(null)

  const selected       = options.find(o => o.id === form.opportunityId)
  const showEducation  = selected?.kind === "internship" || selected?.kind === "paid"
  const showCredit     = selected?.kind === "internship"
  const showResume     = selected?.kind === "internship" || selected?.kind === "paid"
  const showScreening  = Boolean(selected)

  useEffect(() => {
    function onSelect(e: Event) {
      const id = (e as CustomEvent<string>).detail
      if (options.some(o => o.id === id)) {
        setForm(f => ({ ...f, opportunityId: id }))
        setErrors(er => ({ ...er, opportunityId: "" }))
      }
    }
    window.addEventListener(OPPORTUNITY_SELECT_EVENT, onSelect)
    return () => window.removeEventListener(OPPORTUNITY_SELECT_EVENT, onSelect)
  }, [options])

  function set(key: keyof FormData, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: "" }))
  }
  function toggle(key: "days"|"times", value: string) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value]
    }))
    setErrors(e => ({ ...e, [key]: "" }))
  }
  function pickResume(file: File | null) {
    if (!file) { clearResume(); return }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (!RESUME_EXTENSIONS.includes(ext)) {
      clearResume(); setResumeError("Please upload a PDF, DOC, or DOCX file.")
    } else if (file.size > RESUME_MAX_BYTES) {
      clearResume(); setResumeError("That file is too large. Please upload a file under 4 MB.")
    } else {
      setResumeError(""); setResume(file)
    }
  }
  function clearResume() {
    setResume(null); setResumeError("")
    if (resumeInput.current) resumeInput.current.value = ""
  }
  function validate() {
    const e: Partial<Record<keyof FormData,string>> = {}
    if (!selected)                        e.opportunityId = "Please choose an opportunity"
    if (!form.name.trim())                e.name = "Required"
    if (!form.email.trim())               e.email = "Required"
    else if (!emailPattern.test(form.email.trim())) e.email = "Enter a valid email address"
    if (!form.days.length)                e.days = "Select at least one day"
    if (!form.times.length)               e.times = "Select at least one time"
    if (!form.statement.trim())           e.statement = "Required"
    if (showEducation && !form.education) e.education = "Required"
    if (showCredit && !form.academicCredit) e.academicCredit = "Required"
    if (showScreening && !form.backgroundCheck) e.backgroundCheck = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }
  async function handleSubmit() {
    if (!validate()) return
    setStatus("loading")
    setServerError("")
    const payload = {
      opportunityId: form.opportunityId,
      otherRoles:    form.otherRoles,
      name:          form.name,
      email:         form.email,
      phone:         form.phone,
      days:          form.days,
      times:         form.times,
      statement:     form.statement,
      notes:         form.notes,
      website:       form.website,
      ...(showEducation && { education: form.education }),
      ...(showCredit    && { academicCredit: form.academicCredit }),
      ...(showScreening && { backgroundCheck: form.backgroundCheck }),
    }
    const data = new FormData()
    data.append("payload", JSON.stringify(payload))
    if (showResume && resume) data.append("resume", resume)
    try {
      const res = await fetch("/api/volunteer", { method: "POST", body: data })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        setServerError(typeof err?.error === "string" ? err.error : "")
        throw new Error()
      }
      setSubmittedTitle(selected?.title || "")
      setStatus("success")
      setForm(empty)
      clearResume()
    } catch { setStatus("error") }
  }

  if (status === "success") {
    return (
      <section id="apply" className="section-padding bg-green-light min-h-[60vh] flex items-center scroll-mt-24">
        <div className="container-max text-center">
          <CheckCircle className="w-16 h-16 text-green-mid mx-auto mb-4" />
          <h2 className="text-green-dark mb-3">Thank You!</h2>
          <p className="text-gray-muted max-w-md mx-auto mb-6">
            We have received your submission{submittedTitle ? <> for <strong>{submittedTitle}</strong></> : null} and
            will be in touch soon with next steps.
          </p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </section>
    )
  }

  return (
    <section id="apply" className="section-padding bg-white scroll-mt-24">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-amber font-semibold text-sm uppercase tracking-widest">Get Started</span>
          <h2 className="text-green-dark mt-3">Apply or Express Interest</h2>
          <p className="text-gray-muted mt-2">
            Choose an opportunity and tell us a little about yourself. We collect emergency contact details during onboarding.
          </p>
        </div>
        <div className="card p-8 space-y-6">
          {/* Honeypot: hidden from real users, bots fill it and get silently dropped server-side */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Website (leave blank)
              <input type="text" tabIndex={-1} autoComplete="off"
                value={form.website} onChange={e=>set("website",e.target.value)}/>
            </label>
          </div>
          {/* Opportunity */}
          <div>
            <label htmlFor="opportunity" className="form-label">Which opportunity are you most interested in? *</label>
            <select id="opportunity" className={`form-input ${errors.opportunityId?"border-red-400":""}`}
              value={form.opportunityId} onChange={e=>set("opportunityId",e.target.value)}>
              <option value="" disabled>Select an opportunity</option>
              {kindSections.map(s => {
                const group = options.filter(o => o.kind === s.kind)
                return group.length > 0 && (
                  <optgroup key={s.kind} label={s.heading}>
                    {group.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </optgroup>
                )
              })}
              <optgroup label="Not sure yet">
                {options.filter(o => o.kind === "general").map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
              </optgroup>
            </select>
            {errors.opportunityId&&<p className="text-red-500 text-xs mt-1">{errors.opportunityId}</p>}
            <label htmlFor="otherRoles" className="form-label mt-4">Other roles you would consider (optional)</label>
            <input id="otherRoles" className="form-input" placeholder="e.g. Program Facilitator, Community Outreach Ambassador"
              value={form.otherRoles} onChange={e=>set("otherRoles",e.target.value)}/>
          </div>
          {/* Personal */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.name?"border-red-400":""}`}
                  placeholder="First and last name" value={form.name} onChange={e=>set("name",e.target.value)}/>
                {errors.name&&<p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input className={`form-input ${errors.email?"border-red-400":""}`}
                  type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)}/>
                {errors.email&&<p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="form-label">Phone (optional)</label>
                <input className="form-input"
                  type="tel" placeholder="850-000-0000" value={form.phone} onChange={e=>set("phone",e.target.value)}/>
              </div>
            </div>
          </div>
          {/* Availability */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Availability</h3>
            <p className="form-label mb-2">Days Available *</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {daysOfWeek.map(day=>(
                <button key={day} type="button" onClick={()=>toggle("days",day)}
                  aria-pressed={form.days.includes(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2
                    ${form.days.includes(day)?"bg-green-dark text-white border-green-dark":"bg-white text-gray-muted border-gray-border hover:border-green-mid"}`}>
                  {day.slice(0,3)}
                </button>
              ))}
            </div>
            {errors.days&&<p className="text-red-500 text-xs mb-3">{errors.days}</p>}
            <p className="form-label mb-2">Preferred Times *</p>
            <div className="flex flex-col gap-2">
              {timeSlots.map(t=>(
                <label key={t} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-green-mid"
                    checked={form.times.includes(t)} onChange={()=>toggle("times",t)}/>
                  <span className="text-sm text-gray-body">{t}</span>
                </label>
              ))}
            </div>
            {errors.times&&<p className="text-red-500 text-xs mt-1">{errors.times}</p>}
          </div>
          {/* Statement of interest */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Statement of Interest *</h3>
            <textarea className={`form-input min-h-[100px] ${errors.statement?"border-red-400":""}`}
              placeholder="Tell us briefly why you are interested and share any relevant skills or experience."
              value={form.statement} onChange={e=>set("statement",e.target.value)}/>
            {errors.statement&&<p className="text-red-500 text-xs mt-1">{errors.statement}</p>}
          </div>
          {/* Role-specific questions */}
          {(showEducation || showCredit || showResume || showScreening) && (
            <div>
              <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">About This Opportunity</h3>
              <div className="space-y-5">
                {showEducation && (
                  <div>
                    <label htmlFor="education" className="form-label">Highest Level of Education Completed *</label>
                    <select id="education" className={`form-input ${errors.education?"border-red-400":""}`}
                      value={form.education} onChange={e=>set("education",e.target.value)}>
                      <option value="" disabled>Select an option</option>
                      {educationOptions.map(o=>(
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    {errors.education&&<p className="text-red-500 text-xs mt-1">{errors.education}</p>}
                  </div>
                )}
                {showCredit && (
                  <div>
                    <p className="form-label">Are you seeking academic credit for this internship? *</p>
                    <div className="flex flex-wrap gap-2">
                      {creditOptions.map(o=>(
                        <label key={o} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                          <input type="radio" name="academicCredit" className="w-4 h-4 accent-green-mid"
                            checked={form.academicCredit===o} onChange={()=>set("academicCredit",o)}/>
                          <span className="text-sm text-gray-body">{o}</span>
                        </label>
                      ))}
                    </div>
                    {errors.academicCredit&&<p className="text-red-500 text-xs mt-1">{errors.academicCredit}</p>}
                  </div>
                )}
                {showResume && (
                  <div>
                    <label htmlFor="resume" className="form-label">Upload your résumé (optional)</label>
                    <input id="resume" ref={resumeInput} type="file" accept=".pdf,.doc,.docx"
                      className="block w-full text-sm text-gray-body file:mr-4 file:rounded-lg file:border-0 file:bg-green-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-dark hover:file:bg-green-mid/20"
                      onChange={e=>pickResume(e.target.files?.[0] ?? null)}/>
                    <p className="text-xs text-gray-muted mt-1">PDF, DOC, or DOCX, up to 4 MB.</p>
                    {resume && (
                      <p className="text-sm text-gray-body mt-2">
                        Selected: <span className="font-semibold">{resume.name}</span>{" "}
                        <button type="button" onClick={clearResume} className="text-amber underline ml-2">Remove</button>
                      </p>
                    )}
                    {resumeError&&<p className="text-red-500 text-xs mt-1">{resumeError}</p>}
                  </div>
                )}
                {showScreening && (
                  <div>
                    <p className="form-label">A Level 2 background screening is required for all roles. Are you willing to complete it? *</p>
                    <div className="flex flex-col gap-2">
                      {bgOptions.map(o=>(
                        <label key={o} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-light transition-colors">
                          <input type="radio" name="bgCheck" className="w-4 h-4 accent-green-mid"
                            checked={form.backgroundCheck===o} onChange={()=>set("backgroundCheck",o)}/>
                          <span className="text-sm text-gray-body">{o}</span>
                        </label>
                      ))}
                    </div>
                    {errors.backgroundCheck&&<p className="text-red-500 text-xs mt-1">{errors.backgroundCheck}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Notes */}
          <div>
            <h3 className="text-green-dark mb-4 pb-2 border-b border-gray-border">Additional Notes (optional)</h3>
            <textarea className="form-input min-h-[80px]"
              placeholder="Is there anything else you'd like us to know?"
              value={form.notes} onChange={e=>set("notes",e.target.value)}/>
          </div>
          {status==="error"&&(
            <p className="text-red-500 text-sm text-center">
              {serverError || "Something went wrong. Please email us at info@teeshouse.org"}
            </p>
          )}
          <button onClick={handleSubmit} disabled={status==="loading"}
            className="btn-amber w-full justify-center text-base py-4">
            {status==="loading"
              ? <><Loader2 className="w-5 h-5 animate-spin"/>Submitting...</>
              : "Submit"}
          </button>
        </div>
      </div>
    </section>
  )
}
