"use client"
import { useState } from "react"
import { Heart, Star } from "lucide-react"
import Link from "next/link"

// Donors can be managed via Sanity or hardcoded here
// Format: { name, tier, anonymous, message }
const DONORS = [
  { name: "The Johnson Family",    tier: "gold",    message: "Proud to support Tees House!" },
  { name: "Anonymous Friend",      tier: "silver",  message: "" },
  { name: "Dr. Patricia Williams", tier: "gold",    message: "Education changes everything." },
  { name: "Marcus & Diane Reed",   tier: "silver",  message: "" },
  { name: "Northwest FL Community Foundation", tier: "platinum", message: "Building futures together." },
  { name: "Anonymous",             tier: "bronze",  message: "" },
  { name: "Coach Terrell Brown",   tier: "silver",  message: "Go Tees House!" },
  { name: "Anonymous Friend",      tier: "bronze",  message: "" },
  { name: "The Patel Family",      tier: "silver",  message: "Every child deserves this." },
  { name: "Anonymous",             tier: "bronze",  message: "" },
  { name: "Sandra Washington",     tier: "bronze",  message: "Keep growing!" },
  { name: "Anonymous Friend",      tier: "bronze",  message: "" },
]

const TIER_COLORS: Record<string, string> = {
  platinum: "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-700",
  gold:     "bg-gradient-to-br from-amber-50 to-amber-100 border-amber text-amber-dark",
  silver:   "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-600",
  bronze:   "bg-green-light border-green-mid text-green-dark",
}

export default function DonorWall() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? DONORS : DONORS.slice(0, 8)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Supporters</span>
        <h3 className="text-green-dark text-2xl mt-2">Donor Wall of Gratitude</h3>
        <p className="text-gray-muted mt-2 text-sm">Thank you to everyone who has invested in our mission.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {visible.map((donor, i) => (
          <div key={i}
            className={`rounded-card border p-4 text-center transition-transform hover:scale-105 duration-200 ${TIER_COLORS[donor.tier]}`}>
            <div className="flex justify-center mb-2">
              {donor.tier === "platinum" ? <Star className="w-4 h-4 fill-current" /> :
               donor.tier === "gold"     ? <Heart className="w-4 h-4 fill-current text-amber" /> :
               <Heart className="w-3 h-3 fill-current opacity-50" />}
            </div>
            <p className="font-semibold text-sm leading-tight">{donor.name}</p>
            {donor.message && <p className="text-xs mt-1 opacity-70 italic">{donor.message}</p>}
          </div>
        ))}
      </div>

      {DONORS.length > 8 && (
        <div className="text-center mb-6">
          <button onClick={() => setShowAll(!showAll)}
            className="text-sm text-amber font-semibold hover:text-amber-dark transition-colors">
            {showAll ? "Show Less" : `See All ${DONORS.length} Donors`}
          </button>
        </div>
      )}

      <div className="card p-6 text-center bg-amber-light border border-amber/20">
        <p className="text-green-dark font-semibold mb-1">Your name could be here.</p>
        <p className="text-gray-muted text-sm mb-4">Join our community of supporters and help us grow.</p>
        <Link href="/donate" className="btn-amber text-sm">
          <Heart className="w-4 h-4" /> Become a Donor
        </Link>
      </div>
    </div>
  )
}