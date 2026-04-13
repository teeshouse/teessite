import type { MetadataRoute } from "next"
import { getNews, getEvents, getPages } from "@/lib/sanity.fetch"

/**
 * Canonical base URL for the site. Update here (or lift into an env var)
 * when the apex domain changes.
 */
const SITE = "https://teeshousepensacola.org"

/** Static top-level routes that should always appear in the sitemap. */
const STATIC_ROUTES: Array<{
  path:       string
  priority:   number
  changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"]
}> = [
  { path: "/",             priority: 1.0, changeFreq: "weekly"  },
  { path: "/about",        priority: 0.9, changeFreq: "monthly" },
  { path: "/community-impact", priority: 0.9, changeFreq: "weekly"  },
  { path: "/events",       priority: 0.8, changeFreq: "weekly"  },
  { path: "/news",         priority: 0.8, changeFreq: "weekly"  },
  { path: "/gallery",      priority: 0.7, changeFreq: "weekly"  },
  { path: "/donate",       priority: 0.9, changeFreq: "monthly" },
  { path: "/volunteer",    priority: 0.8, changeFreq: "monthly" },
  { path: "/intake",       priority: 0.7, changeFreq: "monthly" },
  { path: "/partners",     priority: 0.6, changeFreq: "monthly" },
  { path: "/transparency", priority: 0.6, changeFreq: "monthly" },
  { path: "/services",     priority: 0.7, changeFreq: "monthly" },
  { path: "/faq",          priority: 0.6, changeFreq: "monthly" },
  { path: "/contact",      priority: 0.7, changeFreq: "monthly" },
  { path: "/privacy",      priority: 0.3, changeFreq: "yearly"  },
  { path: "/terms",        priority: 0.3, changeFreq: "yearly"  },
]

/** Re-validated by the same ISR window as the pages themselves. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Kick off all three Sanity fetches in parallel. Each helper swallows
  // errors and returns [] so a CMS outage never breaks sitemap generation.
  const [news, events, pages] = await Promise.all([
    getNews(),
    getEvents(),
    getPages(),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(r => ({
    url:            `${SITE}${r.path}`,
    lastModified:   now,
    changeFrequency: r.changeFreq,
    priority:       r.priority,
  }))

  const newsEntries: MetadataRoute.Sitemap = (news || [])
    .filter((p: any) => p?.slug?.current)
    .map((p: any) => ({
      url:            `${SITE}/news/${p.slug.current}`,
      lastModified:   p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: "monthly",
      priority:       0.6,
    }))

  const eventEntries: MetadataRoute.Sitemap = (events || [])
    .filter((e: any) => e?.slug?.current)
    .map((e: any) => ({
      url:            `${SITE}/events/${e.slug.current}`,
      lastModified:   e.date ? new Date(e.date) : now,
      changeFrequency: "weekly",
      priority:       0.6,
    }))

  const pageEntries: MetadataRoute.Sitemap = (pages || [])
    .filter((p: any) => p?.slug?.current)
    .map((p: any) => ({
      url:            `${SITE}/pages/${p.slug.current}`,
      lastModified:   now,
      changeFrequency: "monthly",
      priority:       0.5,
    }))

  return [...staticEntries, ...newsEntries, ...eventEntries, ...pageEntries]
}
