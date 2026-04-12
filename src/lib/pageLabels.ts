import type {
  PageLabelFields,
  PageLabelsKey,
  PageLabelsSettings,
  SiteSettings,
} from "@/types"

/**
 * Hardcoded defaults for About / Events / News / Gallery page labels.
 * These are the fallbacks used whenever a specific field is blank in
 * Sanity Site Settings -> "Page labels".
 *
 * To rename any of these pages site-wide from Sanity Studio without a
 * code change:
 *   Site Settings -> Page labels (About / Events / News / Gallery)
 *   Expand the page you want to rename, fill in the field you want to
 *   override, save, publish.
 */
export const DEFAULT_PAGE_LABELS: Record<PageLabelsKey, Required<PageLabelFields>> = {
  about: {
    navLabel:        "About",
    pageTitle:       "About Tee\u2019s House",
    pageKicker:      "Who We Are",
    metaTitle:       "About Us | Tee\u2019s House Inc.",
    metaDescription: "Learn about Tee\u2019s House Inc. \u2014 our mission, our team, and how we empower communities in Northwest Florida.",
  },
  events: {
    navLabel:        "Events",
    pageTitle:       "Events",
    pageKicker:      "Join Us",
    metaTitle:       "Events | Tee\u2019s House Inc.",
    metaDescription: "Upcoming and past events from Tee\u2019s House Inc. \u2014 community gatherings, workshops, and fundraisers in Pensacola, FL.",
  },
  news: {
    navLabel:        "News",
    pageTitle:       "News & Updates",
    pageKicker:      "Stay Informed",
    metaTitle:       "News | Tee\u2019s House Inc.",
    metaDescription: "Latest news and updates from Tee\u2019s House Inc. \u2014 stories of impact, announcements, and community highlights.",
  },
  gallery: {
    navLabel:        "Gallery",
    pageTitle:       "Photo Gallery",
    pageKicker:      "Our Story in Photos",
    metaTitle:       "Gallery | Tee\u2019s House Inc.",
    metaDescription: "Photos from Tee\u2019s House programs, events, and community moments in Pensacola, FL.",
  },
}

/**
 * Merge Sanity-provided labels for a single page with the defaults.
 * Any blank/missing field falls back to the hardcoded value above.
 */
export function resolvePageLabels(
  key: PageLabelsKey,
  settings: Pick<SiteSettings, "pageLabels"> | null | undefined,
): Required<PageLabelFields> {
  const s: PageLabelFields = settings?.pageLabels?.[key] ?? {}
  const d = DEFAULT_PAGE_LABELS[key]
  return {
    navLabel:        s.navLabel        || d.navLabel,
    pageTitle:       s.pageTitle       || d.pageTitle,
    pageKicker:      s.pageKicker      || d.pageKicker,
    metaTitle:       s.metaTitle       || d.metaTitle,
    metaDescription: s.metaDescription || d.metaDescription,
  }
}

/**
 * Resolve the full set in one shot. Handy for Navbar/Footer which need
 * every nav label at once.
 */
export function resolveAllPageLabels(
  settings: Pick<SiteSettings, "pageLabels"> | null | undefined,
): Record<PageLabelsKey, Required<PageLabelFields>> {
  return {
    about:   resolvePageLabels("about",   settings),
    events:  resolvePageLabels("events",  settings),
    news:    resolvePageLabels("news",    settings),
    gallery: resolvePageLabels("gallery", settings),
  }
}
