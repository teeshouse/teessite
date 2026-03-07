"use client"
import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" })
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
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="relative bg-green-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Reach Out</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Contact Us</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Our doors are open. Whether you want to volunteer, partner, or learn more â€” we would love to hear from you.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Info */}
              <div>
                <h2 className="text-green-dark mb-6">Get In Touch</h2>
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-green-light rounded-lg shrink-0">
                      <MapPin className="w-5 h-5 text-green-mid" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-body">Location</p>
                      <p className="text-gray-muted text-sm">Pensacola, Florida</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-green-light rounded-lg shrink-0">
                      <Phone className="w-5 h-5 text-green-mid" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-body">Phone</p>
                      <a href="tel:8502911888" className="text-gray-muted text-sm hover:text-green-mid transition-colors">
                        850.291.1888
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-green-light rounded-lg shrink-0">
                      <Mail className="w-5 h-5 text-green-mid" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-body">Email</p>
                      <a href="mailto:info@teeshouse.org" className="text-gray-muted text-sm hover:text-green-mid transition-colors">
                        info@teeshouse.org
                      </a>
                    </div>
                  </li>
                </ul>
                <div className="bg-green-light rounded-card p-6">
                  <p className="font-display italic text-green-dark text-lg">
                    "Together, we can keep growing â€” one seed, one idea, one heart at a time."
                  </p>
                </div>
              </div>

              {/* Form */}
              <div>
                {status === "success" ? (
                  <div className="card p-10 text-center">
                    <CheckCircle className="w-12 h-12 text-green-mid mx-auto mb-4" />
                    <h3 className="text-green-dark mb-2">Message Sent!</h3>
                    <p className="text-gray-muted text-sm">We will get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <div className="card p-8 space-y-4">
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
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}