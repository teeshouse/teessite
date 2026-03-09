import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getNews } from "@/lib/sanity.fetch"
import { Calendar, ArrowRight, Tag } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "News | Tee's House Inc.",
  description: "Latest news and updates from Tee's House Inc."
}

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"
const PLACEHOLDER = `${CDN}/aa3166c4742d84e1137865a365dcfd41de898dca-2048x2048.jpg`

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default async function NewsPage() {
  const articles = await getNews()
  const featured = articles.find((a: any) => a.featured) || articles[0]
  const rest      = articles.filter((a: any) => a._id !== featured?._id)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Stay Informed</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">News &amp; Updates</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              The latest from Tee&apos;s House â€” programs, events, and community stories.
            </p>
          </div>
        </section>

        {articles.length === 0 ? (
          // Empty state
          <section className="section-padding bg-green-light">
            <div className="container-max text-center">
              <div className="card p-16 max-w-lg mx-auto">
                <h2 className="text-green-dark mb-3">Coming Soon</h2>
                <p className="text-gray-muted leading-relaxed mb-6">
                  News and updates are on the way. Check back soon or follow us on social media
                  for the latest from Tee&apos;s House.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/programs" className="btn-primary">Our Programs <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/contact"  className="btn-outline">Contact Us <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <section className="section-padding bg-white">
                <div className="container-max">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="relative h-80 rounded-card overflow-hidden shadow-card-hover">
                      <Image
                        src={featured.featuredImage?.asset?.url || PLACEHOLDER}
                        alt={featured.title} fill className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge-current">Featured</span>
                        {featured.publishedAt && (
                          <span className="flex items-center gap-1 text-xs text-gray-muted">
                            <Calendar className="w-3 h-3" />{formatDate(featured.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-green-dark text-2xl mb-3">{featured.title}</h2>
                      {featured.excerpt && <p className="text-gray-muted leading-relaxed mb-4">{featured.excerpt}</p>}
                      {featured.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featured.tags.map((tag: string) => (
                            <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-green-light rounded text-xs text-green-mid">
                              <Tag className="w-3 h-3" />{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link href={`/news/${featured.slug?.current}`} className="btn-primary text-sm">
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Article grid */}
            {rest.length > 0 && (
              <section className="section-padding bg-green-light">
                <div className="container-max">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rest.map((article: any) => (
                      <Link key={article._id} href={`/news/${article.slug?.current}`}
                        className="card group hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={article.featuredImage?.asset?.url || PLACEHOLDER}
                            alt={article.title} fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5">
                          {article.publishedAt && (
                            <p className="flex items-center gap-1 text-xs text-gray-muted mb-2">
                              <Calendar className="w-3 h-3" />{formatDate(article.publishedAt)}
                            </p>
                          )}
                          <h3 className="text-green-dark text-base mb-2 group-hover:text-green-mid transition-colors">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-gray-muted text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber mt-3">
                            Read More <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
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