import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextComponents } from "@portabletext/react"

/**
 * Shared Portable Text renderer for Sanity long-form content (news articles,
 * CMS pages). Styles match the green/amber/cream brand and the Tailwind
 * config. Keep this as the single source of truth for how block content
 * looks anywhere on the site.
 *
 * Supported block types: h1-h4, blockquote, normal paragraph, lists,
 * inline marks (strong/em/code), external+internal links, and inline
 * images (with alt text and optional caption).
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url: string | undefined = value?.asset?.url
      if (!url) return null
      const alt: string = value?.alt || ""
      const caption: string | undefined = value?.caption
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-card overflow-hidden shadow-card">
            {/* Use intrinsic wrapper with aspect ratio so images don't CLS */}
            <div className="relative aspect-[16/9]">
              <Image
                src={url}
                alt={alt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-gray-muted mt-2 italic">{caption}</figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h1:     ({ children }) => <h1 className="text-green-dark text-4xl font-display mt-10 mb-4">{children}</h1>,
    h2:     ({ children }) => <h2 className="text-green-dark text-3xl font-display mt-10 mb-4">{children}</h2>,
    h3:     ({ children }) => <h3 className="text-green-dark text-2xl font-display mt-8 mb-3">{children}</h3>,
    h4:     ({ children }) => <h4 className="text-green-dark text-xl font-display mt-6 mb-2">{children}</h4>,
    normal: ({ children }) => <p  className="text-gray-body leading-relaxed mb-5">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber bg-green-light/50 px-6 py-4 my-6 italic text-green-dark rounded-r-card">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-gray-body">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-gray-body">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-green-dark">{children}</strong>,
    em:     ({ children }) => <em className="italic">{children}</em>,
    code:   ({ children }) => <code className="px-1.5 py-0.5 bg-cream rounded text-sm font-mono text-green-dark">{children}</code>,
    link: ({ value, children }) => {
      const href: string = value?.href || "#"
      const isInternal = href.startsWith("/")
      if (isInternal) {
        return <Link href={href} className="text-amber hover:text-amber-dark underline underline-offset-2">{children}</Link>
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-amber hover:text-amber-dark underline underline-offset-2">
          {children}
        </a>
      )
    },
  },
}

export default function PortableTextBody({ value }: { value: any[] | undefined }) {
  if (!value || value.length === 0) return null
  return <PortableText value={value} components={components} />
}
