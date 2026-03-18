"use client"
import { useState } from "react"
import Link from "next/link"
import { Heart, ChevronRight } from "lucide-react"

const IMPACTS = [
  { amount: 10,   label: "provides art supplies for 2 students for a week" },
  { amount: 25,   label: "feeds 5 students nutritious snacks for a week" },
  { amount: 50,   label: "sponsors one student for a full program session" },
  { amount: 100,  label: "funds a full week of after-school enrichment" },
  { amount: 250,  label: "covers supplies for an entire program cohort" },
  { amount: 500,  label: "sponsors a student for an entire semester" },
  { amount: 1000, label: "funds a complete program from start to finish" },
]

const PAYPAL = "https://www.paypal.com/donate/?hosted_button_id=XSHDRCQ2L66JW"

export default function ImpactCalculator() {
  const [selected, setSelected] = useState(50)
  const [custom,   setCustom]   = useState("")

  const amount  = custom ? parseInt(custom) || 0 : selected
  const impact  = IMPACTS.reduce((best, curr) => amount >= curr.amount ? curr : best, IMPACTS[0])
  const multiplier = amount > 0 ? Math.floor(amount / impact.amount) : 1
  const display = multiplier > 1
    ? `Your $${amount} ${impact.label.replace(/^(provides|feeds|sponsors|covers|funds)/, m => m)} â€” ${multiplier}x the impact!`
    : `Your $${amount} ${impact.label}.`

  return (
    <div className="card p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <span className="text-amber font-semibold text-sm uppercase tracking-widest">See Your Impact</span>
        <h3 className="text-green-dark text-2xl mt-2">How Far Your Gift Goes</h3>
      </div>

      {/* Preset amounts */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[10, 25, 50, 100, 250, 500, 1000].slice(0,4).map(amt => (
          <button key={amt}
            onClick={() => { setSelected(amt); setCustom("") }}
            className={`py-3 rounded-card font-semibold text-sm transition-all ${
              selected === amt && !custom
                ? "bg-amber text-white shadow-md scale-105"
                : "bg-green-light text-green-dark hover:bg-amber/20"
            }`}>
            ${amt}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[250, 500, 1000].map(amt => (
          <button key={amt}
            onClick={() => { setSelected(amt); setCustom("") }}
            className={`py-3 rounded-card font-semibold text-sm transition-all ${
              selected === amt && !custom
                ? "bg-amber text-white shadow-md scale-105"
                : "bg-green-light text-green-dark hover:bg-amber/20"
            }`}>
            ${amt}
          </button>
        ))}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-dark font-semibold text-sm">$</span>
          <input
            type="number" placeholder="Other"
            value={custom}
            onChange={e => { setCustom(e.target.value); setSelected(0) }}
            className="w-full py-3 pl-7 pr-3 rounded-card border-2 border-green-light focus:border-amber outline-none text-sm font-semibold text-green-dark"
          />
        </div>
      </div>

      {/* Impact display */}
      {amount > 0 && (
        <div className="bg-amber-light border-l-4 border-amber rounded-card p-5 mb-6 text-center">
          <p className="text-green-dark font-semibold text-lg leading-relaxed">{display}</p>
        </div>
      )}

      {/* Donate button */}
      <a href={`${PAYPAL}&amount=${amount}`} target="_blank" rel="noopener noreferrer"
        className="btn-amber w-full justify-center text-base py-4">
        <Heart className="w-5 h-5" />
        Donate ${amount > 0 ? amount : "Now"} via PayPal
        <ChevronRight className="w-4 h-4" />
      </a>
      <p className="text-center text-xs text-gray-muted mt-3">
        Secure payment via PayPal. Tees House Inc. is a 501(c)(3) nonprofit. Your donation may be tax-deductible.
      </p>
    </div>
  )
}