import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getPageBySlug, getPages } from "@/lib/sanity.fetch"

export const revalidate = 60

export async function generateStaticParams() {
  const pages = await getPages()
  return pages.map((p: any) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)
  if (!page) return { title: "Page Not Found" }
  return { title: `${page.title} | Tees House Inc.`, description: page.excerpt }
}

export default async function CmsPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  if (!page) notFound()

  return (
    <>
      <Navbar />
      <main>
        {page.heroImage?.asset?.url && (
          <section className="relative text-white py-28 px-4 overflow-hidden">
            <Image src={page.heroImage.asset.url} alt={page.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-green-dark/75" />
            <div className="container-max relative z-10 text-center">
              <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">{page.title}</h1>
            </div>
          </section>
        )}

        {!page.heroImage?.asset?.url && (
          <section className="bg-green-dark text-white py-20 px-4">
            <div className="container-max text-center">
              <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">{page.title}</h1>
              {page.excerpt && <p className="text-green-light text-lg max-w-xl mx-auto">{page.excerpt}</p>}
            </div>
          </section>
        )}

        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl prose prose-lg">
            {page.content?.map((block: any, i: number) => {
              if (block._type === "block") {
                return (
                  <p key={i} className="text-gray-muted leading-relaxed mb-4">
                    {block.children?.map((c: any) => c.text).join("")}
                  </p>
                )
              }
              if (block._type === "image" && block.asset?.url) {
                return (
                  <div key={i} className="relative h-64 my-8 rounded-card overflow-hidden">
                    <Image src={block.asset.url} alt={block.caption || ""} fill className="object-cover" />
                    {block.caption && <p className="text-center text-sm text-gray-muted mt-2">{block.caption}</p>}
                  </div>
                )
              }
              if (block._type === "callout") {
                return (
                  <div key={i} className={`p-6 rounded-card my-6 ${block.style === "warning" ? "bg-amber-light border-l-4 border-amber" : "bg-green-light border-l-4 border-green-mid"}`}>
                    <p className="text-green-dark">{block.text}</p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}