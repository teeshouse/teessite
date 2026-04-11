"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"

interface Props {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  /** Initial slider position 0-100. */
  initial?: number
  /** Aspect ratio (width/height), e.g. "16/9". Defaults to 16/9. */
  aspectRatio?: string
}

/**
 * Accessible before/after image comparison slider.
 * Drag with mouse/touch or use arrow keys on the handle when focused.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "Before",
  afterLabel = "After",
  initial = 50,
  aspectRatio = "16/9",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(initial)
  const draggingRef = useRef(false)

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const raw = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, raw)))
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      setFromClientX(clientX)
    }
    const up = () => {
      draggingRef.current = false
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    window.addEventListener("touchmove", move, { passive: true })
    window.addEventListener("touchend", up)
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
      window.removeEventListener("touchmove", move)
      window.removeEventListener("touchend", up)
    }
  }, [setFromClientX])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5))
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5))
    else if (e.key === "Home") setPos(0)
    else if (e.key === "End") setPos(100)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto select-none overflow-hidden rounded-card shadow-lg"
      style={{ aspectRatio }}
      onMouseDown={(e) => {
        draggingRef.current = true
        setFromClientX(e.clientX)
      }}
      onTouchStart={(e) => {
        draggingRef.current = true
        setFromClientX(e.touches[0].clientX)
      }}
    >
      {/* After image (full) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
      <span className="absolute bottom-3 right-3 z-20 rounded bg-black/60 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        {afterLabel}
      </span>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <div
          className="relative h-full"
          style={{
            width: containerRef.current
              ? `${containerRef.current.getBoundingClientRect().width}px`
              : "100%",
          }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label="Before and after comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-dark shadow-lg ring-2 ring-green-dark/20 focus:outline-none focus:ring-4 focus:ring-amber"
        >
          <span className="text-lg leading-none">&#8596;</span>
        </button>
      </div>
    </div>
  )
}
