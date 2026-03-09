import { groq } from "next-sanity"

// Site Settings (singleton)
export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    heroHeadline, heroSubtext, missionTagline,
    phone, email, address,
    facebookUrl, instagramUrl,
    paypalDonateLink
  }
`

// Impact Stats
export const IMPACT_STATS_QUERY = groq`
  *[_type == "impactStat"] | order(order asc) {
    label, value, icon, order
  }
`

// Programs
export const PROGRAMS_QUERY = groq`
  *[_type == "program"] | order(year desc, title asc) {
    _id, title, slug, status, year, category,
    description, featured,
    image { asset->{ url, metadata { dimensions } } }
  }
`

export const FEATURED_PROGRAMS_QUERY = groq`
  *[_type == "program" && featured == true] | order(year desc) {
    _id, title, slug, status, year, category,
    description,
    image { asset->{ url, metadata { dimensions } } }
  }
`

// News
export const NEWS_QUERY = groq`
  *[_type == "news"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, tags, featured,
    featuredImage { asset->{ url, metadata { dimensions } } }
  }
`

export const FEATURED_NEWS_QUERY = groq`
  *[_type == "news" && featured == true] | order(publishedAt desc)[0..2] {
    _id, title, slug, publishedAt, excerpt, tags,
    featuredImage { asset->{ url, metadata { dimensions } } }
  }
`

// Volunteer Roles
export const VOLUNTEER_ROLES_QUERY = groq`
  *[_type == "volunteerRole" && active == true] | order(order asc) {
    _id, title, icon, description, responsibilities, order
  }
`