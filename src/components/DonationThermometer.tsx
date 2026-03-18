"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Users } from "lucide-react"

interface Props {
  goal:    number
  raised:  number
  donors:  number
  label:   string
  deadline?: string
}

export default function DonationThermometer({ goal, raised, donors, label, deadline }: Props) {
  const [animated, setAnimated] = useState(0)
  const pct = Math.min(Math.round((raised / goal) * 100), 100)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 300)
    return () => clearTimeout(timer)
  }, [pct])

  return (
    <div className="card p-8 max-w-2xl mx-auto text-center">
      <span className="text-amber font-semibold text-sm uppercase tracking-widest">Fundraising Goal</span>
      <h3 className="text-green-dark text-2xl mt-2 mb-2">{label}</h3>
      {deadline && <p className="text-gray-muted text-sm mb-6">Goal deadline: {deadline}</p>}

      {/* Progress bar */}
      <div className="relative h-8 bg-green-light rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-amber to-amber-dark rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
          style={{ width: `${animated}%` }}>
          {animated > 15 && <span className="text-white text-xs font-bold">{pct}%</span>}
        </div>
        {animated <= 15 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-dark text-xs font-bold">{pct}%</span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-light rounded-card p-4">
          <p className="text-2xl font-bold text-amber">${raised.toLocaleString()}</p>
          <p className="text-xs text-gray-muted">Raised</p>
        </div>
        <div className="bg-green-light rounded-card p-4">
          <p className="text-2xl font-bold text-green-dark">${goal.toLocaleString()}</p>
          <p className="text-xs text-gray-muted">Goal</p>
        </div>
        <div className="bg-green-light rounded-card p-4">
          <p className="text-2xl font-bold text-green-dark">{donors}</p>
          <p className="text-xs text-gray-muted">Donors</p>
        </div>
      </div>

      <p className="text-gray-muted text-sm mb-6">
        We need <span className="font-bold text-green-dark">${(goal - raised).toLocaleString()}</span> more to reach our goal.
        Every gift makes a difference.
      </p>

      <Link href="/donate" className="btn-amber w-full justify-center">
        <Heart className="w-4 h-4" /> Make a Gift Today
      </Link>
    </div>
  )
}