import type { ProgramsPageSettings, SiteSettings } from "@/types"

/**
 * Hardcoded defaults for the Community Impact / Programs page labels.
 * These are used as fallbacks whenever a specific field is missing from
 * the `programsPage` object in Sanity `siteSettings`.
 *
 * To rename the page site-wide from Sanity Studio, edit
 *   Site Settings -> Community Impact / Programs page labels
 * and publish. No code change required.
 */
export const DEFAULT_PROGRAMS_LABELS: Required<ProgramsPageSettings> = {
  navLabel:        "Community Impact",
  pageTitle:       "Community Impact",
  pageKicker:      "Our Work in Action",
  metaTitle:       "Community Impact | Tee\u2019s House Inc.",
  metaDescription: "See the community impact of Tee\u2019s House \u2014 programs cultivating creativity, education, and growth in Pensacola, FL.",
  homeHeroCta:     "Community Impact",
  homeListCta:     "See Community Impact",
}

/**
 * Merge Sanity-provided labels with the defaults. Any blank/missing field
 * falls back to the hardcoded value above.
 */
export function resolveProgramsLabels(
  settings: Pick<SiteSettings, "programsPage"> | null | undefined
): Required<ProgramsPageSettings> {
  const s = settings?.programsPage || {}
  return {
    navLabel:        s.navLabel        || DEFAULT_PROGRAMS_LABELS.navLabel,
    pageTitle:       s.pageTitle       || DEFAULT_PROGRAMS_LABELS.pageTitle,
    pageKicker:      s.pageKicker      || DEFAULT_PROGRAMS_LABELS.pageKicker,
    metaTitle:       s.metaTitle       || DEFAULT_PROGRAMS_LABELS.metaTitle,
    metaDescription: s.metaDescription || DEFAULT_PROGRAMS_LABELS.metaDescription,
    homeHeroCta:     s.homeHeroCta     || DEFAULT_PROGRAMS_LABELS.homeHeroCta,
    homeListCta:     s.homeListCta     || DEFAULT_PROGRAMS_LABELS.homeListCta,
  }
}
