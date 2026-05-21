import type { Metadata } from "next"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getGallery, getSiteSettings } from "@/lib/sanity.fetch"
import { resolvePageLabels } from "@/lib/pageLabels"
import { Camera, ArrowRight } from "lucide-react"
import Link from "next/link"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const labels = resolvePageLabels("gallery", await getSiteSettings())
  return { title: labels.metaTitle, description: labels.metaDescription }
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"
const PLACEHOLDER = `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`

export default async function GalleryPage() {
  const [albums, settings] = await Promise.all([getGallery(), getSiteSettings()])
  const labels = resolvePageLabels("gallery", settings)

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">{labels.pageKicker}</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">{labels.pageTitle}</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Moments from our programs, events, and community â€” captured in photos.
            </p>
          </div>
        </section>

        <section className="section-padding bg-green-light">
          <div className="container-max">
            {albums.length === 0 ? (
              <div className="card p-16 max-w-lg mx-auto text-center">
                <Camera className="w-12 h-12 text-amber mx-auto mb-4" />
                <h2 className="text-green-dark mb-3">Photos Coming Soon</h2>
                <p className="text-gray-muted mb-6">Our gallery is being built. Check back soon!</p>
                <Link href="/community-impact" className="btn-primary">See Our Programs <ArrowRight className="w-4 h-4" /></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album: any) => (
                  <Link key={album._id} href={`/gallery/${album.slug?.current}`} className="card overflow-hidden group hover:-translate-y-1 transition-transform duration-300 block">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={album.coverImage?.asset?.url || PLACEHOLDER}
                        alt={album.title} fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-green-dark/40 group-hover:bg-green-dark/20 transition-colors" />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-white font-semibold text-sm bg-green-dark/60 px-2 py-1 rounded">
                          {album.photos?.length || 0} photos
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-green-dark text-lg mb-1">{album.title}</h3>
                      {album.date && <p className="text-xs text-gray-muted mb-2">{new Date(album.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>}
                      {album.description && <p className="text-gray-muted text-sm leading-relaxed">{album.description}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
