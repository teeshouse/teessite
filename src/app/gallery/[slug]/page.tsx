"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { getGalleryBySlug } from "@/lib/sanity.fetch"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

// NOTE: This page is a Client Component so the lightbox state works.
// Data is fetched client-side via useEffect.

export default function GalleryAlbumPage({ params }: { params: { slug: string } }) {
  const [album, setAlbum]           = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [lightbox, setLightbox]     = useState<number | null>(null)

  useEffect(() => {
    getGalleryBySlug(params.slug).then((data) => {
      setAlbum(data)
      setLoading(false)
    })
  }, [params.slug])

  const photos: any[] = album?.photos || []

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }, [photos.length])

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % photos.length))
  }, [photos.length])

  // Keyboard navigation
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

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  return (
    <>
      <Navbar />
      <main>
        {/* Hero / header */}
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max">
            <Link href="/gallery" className="inline-flex items-center gap-2 text-green-light hover:text-white transition-colors text-sm mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Gallery
            </Link>
            {loading ? (
              <div className="h-10 w-64 bg-white/10 rounded animate-pulse" />
            ) : album ? (
              <>
                <h1 className="text-white text-4xl md:text-5xl mb-3">{album.title}</h1>
                <div className="flex flex-wrap gap-4 items-center">
                  {album.date && (
                    <span className="text-green-light text-sm">
                      {new Date(album.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                    </span>
                  )}
                  <span className="text-amber font-semibold text-sm">{photos.length} photo{photos.length !== 1 ? "s" : ""}</span>
                </div>
                {album.description && (
                  <p className="text-green-light mt-4 max-w-2xl text-lg">{album.description}</p>
                )}
              </>
            ) : (
              <h1 className="text-white text-4xl">Album Not Found</h1>
            )}
          </div>
        </section>

        {/* Photo grid */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !album ? (
              <div className="card p-16 max-w-lg mx-auto text-center">
                <Camera className="w-12 h-12 text-amber mx-auto mb-4" />
                <h2 className="text-green-dark mb-3">Album Not Found</h2>
                <p className="text-gray-muted mb-6">This album may have been removed or the link is incorrect.</p>
                <Link href="/gallery" className="btn-primary">Back to Gallery <ArrowLeft className="w-4 h-4" /></Link>
              </div>
            ) : photos.length === 0 ? (
              <div className="card p-16 max-w-lg mx-auto text-center">
                <Camera className="w-12 h-12 text-amber mx-auto mb-4" />
                <h2 className="text-green-dark mb-3">No Photos Yet</h2>
                <p className="text-gray-muted mb-6">Photos for this album haven&apos;t been added yet. Check back soon!</p>
                <Link href="/gallery" className="btn-primary">Back to Gallery <ArrowLeft className="w-4 h-4" /></Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setLightbox(idx)}
                    className="group relative aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
                  >
                    <Image
                      src={photo.image?.asset?.url || ""}
                      alt={photo.caption || `Photo ${idx + 1}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-green-dark/0 group-hover:bg-green-dark/20 transition-colors duration-300" />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-dark/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs leading-snug line-clamp-2">{photo.caption}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightbox + 1} / {photos.length}
          </div>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl w-full max-h-[80vh]"
            style={{ aspectRatio: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh]">
              <Image
                src={photos[lightbox].image?.asset?.url || ""}
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

          {/* Next */}
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
