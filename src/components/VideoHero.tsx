"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface Props {
  /** Optional video URL (mp4/webm). If omitted or fails, poster image is used. */
  videoSrc?: string
  /** Fallback/poster image (always required — shown before video loads). */
  posterSrc: string
  posterAlt?: string
  /** Overlay tint class, e.g. "bg-green-dark/75". */
  overlayClassName?: string
  children: React.ReactNode
}

/**
 * Full-bleed hero that plays a muted, looping background video when available
 * and gracefully falls back to a still image. Respects prefers-reduced-motion.
 */
export default function VideoHero({
  videoSrc,
  posterSrc,
  posterAlt = "",
  overlayClassName = "bg-green-dark/75",
  children,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [canPlayVideo, setCanPlayVideo] = useState(false)

  useEffect(() => {
    if (!videoSrc) return
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return
    setCanPlayVideo(true)
  }, [videoSrc])

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        className="object-cover"
      />
      {canPlayVideo && videoSrc && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setCanPlayVideo(false)}
        />
      )}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="container-max relative z-10 text-center py-24">{children}</div>
    </section>
  )
}
