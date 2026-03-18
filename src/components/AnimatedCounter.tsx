"use client"
import { useEffect, useRef, useState } from "react"

interface Props {
  value:    string   // e.g. "150+" or "12"
  label:    string
  duration?: number
}

function parseValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^(\d+)(.*)$/)
  if (!match) return { num: 0, suffix: val }
  return { num: parseInt(match[1]), suffix: match[2] || "" }
}

export default function AnimatedCounter({ value, label, duration = 2000 }: Props) {
  const { num, suffix } = parseValue(value)
  const [count,   setCount]   = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const steps    = 60
    const stepTime = duration / steps
    const increment = num / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= num) { setCount(num); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, stepTime)
    return () => clearInterval(timer)
  }, [started, num, duration])

  return (
    <div ref={ref} className="text-center p-6 rounded-card bg-white/5 border border-white/10">
      <div className="text-4xl md:text-5xl font-bold text-amber mb-1">
        {count}{suffix}
      </div>
      <div className="text-green-light text-sm">{label}</div>
    </div>
  )
}