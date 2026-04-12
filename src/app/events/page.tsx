import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getEvents, getSiteSettings } from "@/lib/sanity.fetch"
import { resolvePageLabels } from "@/lib/pageLabels"
import { Calendar, MapPin, ExternalLink, ArrowRight } from "lucide-react"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const labels = resolvePageLabels("events", await getSiteSettings())
  return { title: labels.metaTitle, description: labels.metaDescription }
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"
const PLACEHOLDER = `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export default async function EventsPage() {
  const [events, settings] = await Promise.all([getEvents(), getSiteSettings()])
  const labels   = resolvePageLabels("events", settings)
  const upcoming = events.filter((e: any) => e.status === "upcoming")
  const past     = events.filter((e: any) => e.status === "past")

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">{labels.pageKicker}</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">{labels.pageTitle}</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Connect with Tee’s House at our upcoming programs, fundraisers, and community gatherings.
            </p>
          </div>
        </section>

        {events.length === 0 ? (
          <section className="section-padding bg-green-light">
            <div className="container-max text-center">
              <div className="card p-16 max-w-lg mx-auto">
                <Calendar className="w-12 h-12 text-amber mx-auto mb-4" />
                <h2 className="text-green-dark mb-3">Events Coming Soon</h2>
                <p className="text-gray-muted mb-6">Check back soon or contact us to learn about upcoming events.</p>
                <Link href="/contact" className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="section-padding bg-green-light">
                <div className="container-max">
                  <div className="text-center mb-12">
                    <span className="text-amber font-semibold text-sm uppercase tracking-widest">What is Coming Up</span>
                    <h2 className="text-green-dark mt-3">Upcoming Events</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcoming.map((event: any) => (
                      <div key={event._id} className="card overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <Image src={event.image?.asset?.url || PLACEHOLDER} alt={event.title} fill className="object-cover" />
                          {event.featured && <span className="absolute top-3 left-3 badge-current">Featured</span>}
                        </div>
                        <div className="p-6">
                          <h3 className="text-green-dark text-xl mb-3">{event.title}</h3>
                          <div className="flex flex-col gap-2 mb-4">
                            {event.date && (
                              <span className="flex items-center gap-2 text-sm text-gray-muted">
                                <Calendar className="w-4 h-4 text-amber shrink-0" />
                                {formatDate(event.date)} at {formatTime(event.date)}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-2 text-sm text-gray-muted">
                                <MapPin className="w-4 h-4 text-amber shrink-0" />{event.location}
                              </span>
                            )}
                            {event.virtual && (
                              <span className="flex items-center gap-2 text-sm text-amber font-semibold">Virtual Event</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-green-mid">{event.free ? "Free" : event.cost || "See details"}</span>
                            {event.registrationLink && (
                              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
                                className="btn-primary text-sm py-2">
                                Register <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section className="section-padding bg-white">
                <div className="container-max">
                  <div className="text-center mb-12">
                    <span className="text-amber font-semibold text-sm uppercase tracking-widest">Looking Back</span>
                    <h2 className="text-green-dark mt-3">Past Events</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {past.map((event: any) => (
                      <div key={event._id} className="card overflow-hidden opacity-80">
                        <div className="relative h-36 overflow-hidden">
                          <Image src={event.image?.asset?.url || PLACEHOLDER} alt={event.title} fill className="object-cover grayscale" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-green-dark text-base mb-1">{event.title}</h3>
                          {event.date && (
                            <p className="text-xs text-gray-muted">{formatDate(event.date)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}