import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PortableTextBody from "@/components/PortableTextBody"
import { getNews, getNewsBySlug, getSiteSettings } from "@/lib/sanity.fetch"
import { resolvePageLabels } from "@/lib/pageLabels"
import { Calendar, ArrowLeft, Tag } from "lucide-react"

export const revalidate = 60

/**
 * Pre-render every published news article at build time. Any new post
 * added from Sanity after deploy will be generated on-demand the first
 * time it's requested and then cached until the next revalidation.
 */
export async function generateStaticParams() {
  const articles = await getNews()
  return articles
    .filter((a: any) => a?.slug?.current)
    .map((a: any) => ({ slug: a.slug.current as string }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug)
  if (!article) return { title: "Article Not Found | Tee\u2019s House Inc." }
  return {
    title:       `${article.title} | Tee\u2019s House Inc.`,
    description: article.excerpt || undefined,
    openGraph: {
      title:       article.title,
      description: article.excerpt || undefined,
      type:        "article",
      publishedTime: article.publishedAt,
      images: article.featuredImage?.asset?.url
        ? [{ url: article.featuredImage.asset.url }]
        : undefined,
    },
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default async function NewsArticlePage(
  { params }: { params: { slug: string } }
) {
  const [article, settings] = await Promise.all([
    getNewsBySlug(params.slug),
    getSiteSettings(),
  ])
  if (!article) notFound()

  const newsLabels = resolvePageLabels("news", settings)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative text-white py-24 px-4 overflow-hidden bg-green-dark">
          {article.featuredImage?.asset?.url && (
            <>
              <Image
                src={article.featuredImage.asset.url}
                alt={article.featuredImage.alt || article.title}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-green-dark/75" />
            </>
          )}
          <div className="container-max relative z-10 max-w-3xl">
            <Link href="/news" className="inline-flex items-center gap-1 text-green-light text-sm hover:text-amber transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to {newsLabels.navLabel}
            </Link>
            <h1 className="text-white text-3xl md:text-5xl mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-green-light text-sm">
              {article.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-amber" />
                  {formatDate(article.publishedAt)}
                </span>
              )}
              {article.tags?.length > 0 && (
                <span className="flex flex-wrap items-center gap-2">
                  {article.tags.map((t: string) => (
                    <span key={t} className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs">
                      <Tag className="w-3 h-3" />{t}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl">
            {article.excerpt && (
              <p className="text-xl text-green-dark font-display italic mb-8 leading-relaxed">
                {article.excerpt}
              </p>
            )}
            <PortableTextBody value={article.body} />
            {(!article.body || article.body.length === 0) && (
              <p className="text-gray-muted italic">This article does not have a body yet. Check back soon.</p>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="section-padding bg-green-light">
          <div className="container-max max-w-3xl text-center">
            <Link href="/news" className="btn-primary">
              <ArrowLeft className="w-4 h-4" /> See all {newsLabels.navLabel.toLowerCase()}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
