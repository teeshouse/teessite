"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

/** Ask Sanity CDN for a resized/compressed version instead of the raw upload */
function sanityThumb(url: string, width: number, quality = 75) {
  if (!url || !url.includes("cdn.sanity.io")) return url
  return `${url}?w=${width}&q=${quality}&auto=format&fit=max`
}

export type GalleryPhoto = {
  caption?: string
  image?: { asset?: { url?: string } }
}

export default function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }, [photos.length])

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % photos.length))
  }, [photos.length])

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "Escape")     setLightbox(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  return (
    <>
      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setLightbox(idx)}
            className="group relative aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
          >
            {photo.image?.asset?.url && (
              <Image
                src={sanityThumb(photo.image.asset.url, 600)}
                alt={photo.caption || `Photo ${idx + 1}`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-green-dark/0 group-hover:bg-green-dark/20 transition-colors duration-300" />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-dark/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs leading-snug line-clamp-2">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightbox + 1} / {photos.length}
          </div>

          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh]">
              <Image
                src={sanityThumb(photos[lightbox].image?.asset?.url || "", 1400, 85)}
                alt={photos[lightbox].caption || `Photo ${lightbox + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            {photos[lightbox].caption && (
              <p className="text-white/80 text-center text-sm mt-3 px-4">{photos[lightbox].caption}</p>
            )}
          </div>

          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
