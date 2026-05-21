import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Camera } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import GalleryLightbox from "@/components/GalleryLightbox"
import { getGalleryBySlug } from "@/lib/sanity.fetch"

export const revalidate = 60

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const album = await getGalleryBySlug(params.slug)
  if (!album) return { title: "Album Not Found | Tee's House Inc." }
  return {
    title: `${album.title} | Gallery | Tee's House Inc.`,
    description: album.description || `Photos from ${album.title}`,
  }
}

export default async function GalleryAlbumPage({ params }: { params: { slug: string } }) {
  const album = await getGalleryBySlug(params.slug)

  if (!album) notFound()

  const photos = album.photos || []

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-green-light hover:text-white transition-colors text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Gallery
            </Link>
            <h1 className="text-white text-4xl md:text-5xl mb-3">{album.title}</h1>
            <div className="flex flex-wrap gap-4 items-center">
              {album.date && (
                <span className="text-green-light text-sm">
                  {new Date(album.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </span>
              )}
              <span className="text-amber font-semibold text-sm">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </span>
            </div>
            {album.description && (
              <p className="text-green-light mt-4 max-w-2xl text-lg">{album.description}</p>
            )}
          </div>
        </section>

        {/* Photos */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            {photos.length === 0 ? (
              <div className="card p-16 max-w-lg mx-auto text-center">
                <Camera className="w-12 h-12 text-amber mx-auto mb-4" />
                <h2 className="text-green-dark mb-3">No Photos Yet</h2>
                <p className="text-gray-muted mb-6">
                  Photos for this album haven&apos;t been added yet. Check back soon!
                </p>
                <Link href="/gallery" className="btn-primary">
                  Back to Gallery <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <GalleryLightbox photos={photos} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
