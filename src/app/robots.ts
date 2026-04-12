import type { MetadataRoute } from "next"

const SITE = "https://teeshousepensacola.org"

/**
 * Default policy: allow all crawlers on all public pages, block API routes
 * and internal Next.js paths, and point at the sitemap we generate in
 * src/app/sitemap.ts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow: [
          "/api/",      // no reason to crawl our server routes
          "/_next/",    // internal Next.js assets/chunks
          "/admin",     // reserved for future private pages
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host:    SITE,
  }
}
