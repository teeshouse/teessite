"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface Props {
  imageSrc: string
  imageAlt?: string
  /** 0 = no movement, 0.5 = moves half scroll speed (classic parallax). */
  speed?: number
  minHeight?: string
  overlayClassName?: string
  children?: React.ReactNode
}

/**
 * Background image that translates slower than scroll for a parallax effect.
 * Disabled for prefers-reduced-motion.
 */
export default function ParallaxSection({
  imageSrc,
  imageAlt = "",
  speed = 0.3,
  minHeight = "60vh",
  overlayClassName = "bg-green-dark/60",
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setEnabled(false)
      return
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        // distance of the section's top from the viewport middle
        const viewportMid = window.innerHeight / 2
        const delta = rect.top + rect.height / 2 - viewportMid
        setOffset(-delta * speed)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight }}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={
          enabled
            ? { transform: `translate3d(0, ${offset}px, 0) scale(1.15)` }
            : undefined
        }
      >
        <Image src={imageSrc} alt={imageAlt} fill sizes="100vw" className="object-cover" />
      </div>
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="container-max relative z-10 py-24 text-center text-white">
        {children}
      </div>
    </section>
  )
}
