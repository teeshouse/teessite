"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { PayPalLogo, VenmoLogo, CashAppLogo } from "@/components/PaymentLogos"
import { Heart, Sprout, Leaf, Sun, Users, ArrowRight, ExternalLink, Mail, ChevronDown } from "lucide-react"

const impacts = [
  { Icon: Sprout, title: "Fight Food Insecurity",    desc: "Support urban farming and fresh food access for families in need." },
  { Icon: Leaf,   title: "Empower Through Learning", desc: "Fund hands-on education and creative expression programs." },
  { Icon: Sun,    title: "Promote Mental Well-Being", desc: "Sustain nature-based and holistic wellness programs." },
  { Icon: Users,  title: "Build Community",           desc: "Strengthen connections from the ground up in Northwest Florida." }
]

const AMOUNTS = ["$10", "$25", "$50", "$100", "$250", "Other"]

type Method = {
  id: string
  label: string
  desc: string
  Logo: React.ComponentType<{ className?: string }> | null
  action: (amount: string) => void
}

const METHODS: Method[] = [
  {
    id: "paypal",
    label: "PayPal",
    desc: "Donate securely via PayPal â€” all major cards accepted.",
    Logo: PayPalLogo,
    action: () => window.open("https://www.paypal.com/donate/?hosted_button_id=V7PVDP6M5SAY2", "_blank")
  },
  {
    id: "venmo",
    label: "Venmo",
    desc: "Send to @TeesHouseInc on Venmo.",
    Logo: VenmoLogo,
    action: (amount: string) => {
      const amt = amount.replace("$","").replace("Other","")
      const url = amt
        ? `https://venmo.com/TeesHouseInc?txn=pay&amount=${amt}&note=Donation+to+Tees+House`
        : `https://venmo.com/TeesHouseInc`
      window.open(url, "_blank")
    }
  },
  {
    id: "cashapp",
    label: "Cash App",
    desc: "Cashtag coming soon.",
    Logo: CashAppLogo,
    action: () => window.open("https://cash.app", "_blank")
  },
  {
    id: "check",
    label: "Check by Mail",
    desc: "Make checks payable to Tee's House Inc.",
    Logo: null,
    action: () => {}
  }
]

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState("$25")
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const method = METHODS.find(m => m.id === selectedMethod)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative text-white py-28 px-4 overflow-hidden">
          <Image
            src="https://www.teeshouse.org/wp-content/uploads/2025/11/ChatGPT-Image-Nov-2-2025-06_43_51-PM-1.png"
            alt="Tee's House giving back"
            fill className="object-cover" priority
          />
          <div className="absolute inset-0 bg-green-dark/75" />
          <div className="container-max relative text-center z-10">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-amber" />
            </div>
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Support the Mission</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Sow the Seeds of Change</h1>
            <p className="text-green-light text-lg max-w-2xl mx-auto leading-relaxed">
              Every dollar planted at Tee&apos;s House grows into food, education, and hope for our community.
            </p>
          </div>
        </section>

        {/* Donation Widget */}
        <section className="section-padding bg-green-light">
          <div className="container-max max-w-2xl">
            <div className="card p-8">
              <h2 className="text-green-dark text-center mb-2">Make a Donation</h2>
              <p className="text-gray-muted text-center text-sm mb-8">
                Tee&apos;s House Inc. is a registered 501(c)(3) nonprofit. Your donation is tax-deductible.
              </p>

              {/* Amount selector */}
              <div className="mb-6">
                <p className="form-label mb-3">Select an Amount</p>
                <div className="grid grid-cols-3 gap-3">
                  {AMOUNTS.map(amt => (
                    <button key={amt} onClick={() => setSelectedAmount(amt)}
                      className={`py-3 rounded-lg text-sm font-semibold border-2 transition-all
                        ${selectedAmount === amt
                          ? "bg-green-dark text-white border-green-dark"
                          : "bg-white text-gray-body border-gray-border hover:border-green-mid"}`}>
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment method dropdown */}
              <div className="mb-6">
                <p className="form-label mb-3">Choose Payment Method</p>
                <div className="relative">
                  <button onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-border rounded-lg hover:border-green-mid transition-colors text-left">
                    {method ? (
                      <span className="flex items-center gap-3">
                        {method.Logo
                          ? <method.Logo className="h-6 w-auto" />
                          : <Mail className="w-5 h-5 text-green-mid" />}
                        <span className="font-medium text-gray-body">{method.label}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Select a payment method...</span>
                    )}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>

                  {open && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-border rounded-lg shadow-card z-20 overflow-hidden">
                      {METHODS.map(m => (
                        <button key={m.id} onClick={() => { setSelectedMethod(m.id); setOpen(false) }}
                          className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-green-light transition-colors text-left
                            ${selectedMethod === m.id ? "bg-green-light" : ""}`}>
                          <div className="w-16 flex items-center justify-start shrink-0">
                            {m.Logo
                              ? <m.Logo className="h-6 w-auto" />
                              : <Mail className="w-5 h-5 text-green-mid" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-body">{m.label}</p>
                            <p className="text-xs text-gray-muted">{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Check by mail details */}
              {selectedMethod === "check" && (
                <div className="mb-6 p-5 bg-green-light rounded-lg border border-green-mid">
                  <p className="text-sm font-semibold text-green-dark mb-2">Make check payable to:</p>
                  <p className="text-sm text-gray-body font-medium">Tee&apos;s House Inc.</p>
                  <p className="text-sm text-gray-muted mt-1 leading-relaxed">
                    7823 Bay Meadows Dr<br />
                    Pensacola, FL 32507
                  </p>
                  <p className="text-xs text-gray-muted mt-3 italic">
                    Please include your name and email on the memo line for your tax receipt.
                  </p>
                </div>
              )}

              {/* Donate button */}
              {selectedMethod && selectedMethod !== "check" && (
                <button onClick={() => method?.action(selectedAmount)}
                  className="btn-amber w-full justify-center text-base py-4 mb-4">
                  Donate {selectedAmount !== "Other" ? selectedAmount : ""} via {method?.label}
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              {!selectedMethod && (
                <button disabled
                  className="w-full py-4 rounded-lg bg-gray-200 text-gray-400 font-semibold cursor-not-allowed text-base mb-4">
                  Select a payment method above
                </button>
              )}

              <p className="text-center text-xs text-gray-muted">
                Questions? Email{" "}
                <a href="mailto:info@teeshouse.org" className="text-green-mid hover:underline">info@teeshouse.org</a>
                {" "}or call{" "}
                <a href="tel:8502911888" className="text-green-mid hover:underline">850.291.1888</a>
              </p>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">Your Impact</span>
              <h2 className="text-green-dark mt-3">Your Donation Helps Us</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {impacts.map((item) => (
                <div key={item.title} className="card p-6 text-center">
                  <div className="inline-flex p-3 bg-green-light rounded-full mb-4">
                    <item.Icon className="w-6 h-6 text-green-mid" />
                  </div>
                  <h3 className="text-green-dark text-base mb-2">{item.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other ways */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-10">
              <span className="text-amber font-semibold text-sm uppercase tracking-widest">More Ways to Help</span>
              <h2 className="text-green-dark mt-3">Beyond Donations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="card p-7">
                <h3 className="text-green-dark text-lg mb-2">Donate Food</h3>
                <p className="text-gray-muted text-sm leading-relaxed mb-4">
                  Fresh produce and non-perishables are always welcome.
                </p>
                <Link href="/contact" className="btn-primary text-sm">Contact Us <ArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="card p-7">
                <h3 className="text-green-dark text-lg mb-2">Give Your Time</h3>
                <p className="text-gray-muted text-sm leading-relaxed mb-4">
                  From gardening to event support, there is a role for every heart.
                </p>
                <Link href="/volunteer" className="btn-primary text-sm">Volunteer <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding-sm bg-green-dark text-white">
          <div className="container-max text-center px-4">
            <p className="font-display text-2xl italic text-green-light mb-2">
              Together, let us cultivate a future where every family thrives.
            </p>
            <p className="text-amber text-sm">Tee&apos;s House Inc. &bull; 501(c)(3) Nonprofit &bull; Pensacola, FL</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}