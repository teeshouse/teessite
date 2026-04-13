"use client"
import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

export default function ContactForm() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "", website: "" })
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle")

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setStatus("success")
      setForm({ name: "", email: "", subject: "", message: "", website: "" })
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="card p-10 text-center">
        <CheckCircle className="w-12 h-12 text-green-mid mx-auto mb-4" />
        <h3 className="text-green-dark mb-2">Message Sent!</h3>
        <p className="text-gray-muted text-sm">We will get back to you as soon as possible.</p>
      </div>
    )
  }

  return (
    <div className="card p-8 space-y-4">
      {/* Honeypot: hidden from real users, bots fill it and get silently dropped server-side */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website (leave blank)
          <input type="text" tabIndex={-1} autoComplete="off"
            value={form.website} onChange={e => set("website", e.target.value)} />
        </label>
      </div>
      <div>
        <label className="form-label">Name *</label>
        <input className="form-input" placeholder="Your full name"
          value={form.name} onChange={e => set("name", e.target.value)} />
      </div>
      <div>
        <label className="form-label">Email *</label>
        <input className="form-input" type="email" placeholder="you@example.com"
          value={form.email} onChange={e => set("email", e.target.value)} />
      </div>
      <div>
        <label className="form-label">Subject</label>
        <input className="form-input" placeholder="How can we help?"
          value={form.subject} onChange={e => set("subject", e.target.value)} />
      </div>
      <div>
        <label className="form-label">Message *</label>
        <textarea className="form-input min-h-[120px]"
          placeholder="Tell us more..."
          value={form.message} onChange={e => set("message", e.target.value)} />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Please email us directly.</p>
      )}
      <button onClick={handleSubmit} disabled={status === "loading"}
        className="btn-primary w-full justify-center text-base py-4">
        {status === "loading"
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
          : "Send Message"}
      </button>
    </div>
  )
}
