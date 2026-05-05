import { groq } from "next-sanity"

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    heroHeadline, heroSubtext, heroVideoUrl, missionTagline,
    phone, email, address,
    facebookUrl, instagramUrl, linkedinUrl,
    paypalDonateLink,
    beforeAfter {
      beforeLabel, afterLabel, caption,
      beforeImage { asset->{ url } },
      afterImage  { asset->{ url } }
    },
    programsPage {
      navLabel, pageTitle, pageKicker,
      metaTitle, metaDescription,
      homeHeroCta, homeListCta
    },
    pageLabels {
      about   { navLabel, pageTitle, pageKicker, metaTitle, metaDescription },
      events  { navLabel, pageTitle, pageKicker, metaTitle, metaDescription },
      news    { navLabel, pageTitle, pageKicker, metaTitle, metaDescription },
      gallery  { navLabel, pageTitle, pageKicker, metaTitle, metaDescription },
      partners { navLabel, pageTitle, pageKicker, metaTitle, metaDescription }
    },
    donatePage {
      fundraisingGoal, fundraisingRaised, fundraisingDonors,
      fundraisingLabel, fundraisingDeadline,
      givingOptions[] { title, description, buttonLabel, url, isExternal },
      monthlyTiers[]  { amount, impact }
    },
    aboutPage {
      missionHeading,
      missionBody[] { ..., _type == "image" => { ..., asset->{ url } } },
      missionImage { asset->{ url } },
      coreValues[] { title, description },
      contactQuote,
      contactImage { asset->{ url } }
    },
    homePage {
      parallaxHeading, parallaxText,
      parallaxImage { asset->{ url } },
      ctaHeading, ctaText,
      heroImage { asset->{ url } }
    }
  }
`
export const IMPACT_STATS_QUERY = groq`
  *[_type == "impactStat"] | order(order asc) { label, value, icon, order }
`
export const PROGRAMS_QUERY = groq`
  *[_type == "program"] | order(year desc, title asc) {
    _id, title, slug, status, year, category, featured,
    description[] { ..., _type == "image" => { ..., asset->{ url } } },
    image { asset->{ url }, alt },
    gallery[] { alt, caption, asset->{ url } }
  }
`
export const FEATURED_PROGRAMS_QUERY = groq`
  *[_type == "program" && featured == true] | order(year desc) {
    _id, title, slug, status, year, category,
    description[] { ..., _type == "image" => { ..., asset->{ url } } },
    image { asset->{ url }, alt },
    gallery[] { alt, caption, asset->{ url } }
  }
`
export const NEWS_QUERY = groq`
  *[_type == "news"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, tags, featured,
    featuredImage { asset->{ url } }
  }
`
export const NEWS_BY_SLUG_QUERY = groq`
  *[_type == "news" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, excerpt, tags,
    featuredImage { asset->{ url }, alt },
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset->{ url }
      }
    }
  }
`
export const FEATURED_NEWS_QUERY = groq`
  *[_type == "news" && featured == true] | order(publishedAt desc)[0..2] {
    _id, title, slug, publishedAt, excerpt, tags,
    featuredImage { asset->{ url } }
  }
`
export const VOLUNTEER_ROLES_QUERY = groq`
  *[_type == "volunteerRole" && active == true] | order(order asc) {
    _id, title, icon, description, responsibilities, order
  }
`
export const EVENTS_QUERY = groq`
  *[_type == "event"] | order(date asc) {
    _id, title, slug, date, endDate, location, virtual, virtualLink,
    description[] { ..., _type == "image" => { ..., asset->{ url } } },
    registrationLink, free, cost, featured, status, tags,
    image { asset->{ url } },
    gallery[] { alt, caption, asset->{ url } }
  }
`
export const UPCOMING_EVENTS_QUERY = groq`
  *[_type == "event" && status == "upcoming"] | order(date asc) {
    _id, title, slug, date, endDate, location, virtual,
    registrationLink, free, cost, featured,
    image { asset->{ url } },
    gallery[] { alt, caption, asset->{ url } }
  }
`
export const TEAM_QUERY = groq`
  *[_type == "teamMember" && active == true] | order(order asc) {
    _id, name, title, bio, email, linkedin, order, category,
    photo { asset->{ url } }
  }
`
export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id, quote, authorName, authorRole, program, featured, order,
    authorPhoto { asset->{ url } }
  }
`
export const PARTNERS_QUERY = groq`
  *[_type == "partner"] | order(order asc) {
    _id, name, website, description, featured, tier, order,
    logo { asset->{ url } }
  }
`
export const GALLERY_QUERY = groq`
  *[_type == "galleryAlbum"] | order(date desc) {
    _id, title, slug, date, description, featured, program, tags,
    coverImage { asset->{ url } },
    photos[] { caption, image { asset->{ url } } }
  }
`
export const FAQS_QUERY = groq`
  *[_type == "faq" && active == true] | order(order asc) {
    _id, question, answer, category, order
  }
`
export const PAGES_QUERY = groq`
  *[_type == "page" && published == true] | order(navOrder asc) {
    _id, title, slug, excerpt, showInNav, navLabel, navOrder,
    heroImage { asset->{ url } }
  }
`
export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug && published == true][0] {
    _id, title, slug, excerpt, publishedAt, content,
    heroImage { asset->{ url } }
  }
`
export const DOWNLOADS_QUERY = groq`
  *[_type == "download"] | order(order asc) {
    _id, title, description, category, order,
    showOnServicesPage, showOnTransparencyPage,
    file { asset->{ url, originalFilename, size } },
    thumbnail { asset->{ url } }
  }
`
export const SERVICES_QUERY = groq`
  *[_type == "service"] | order(order asc) {
    _id, title, category, price, priceNote, badge, tierNumber, featured, order,
    tagline, items, kitNotes, isSubscription, comingSoon, paypalUrl,
    features, extras,
    image { asset->{ url }, alt }
  }
`
export const ANNUAL_REPORTS_QUERY = groq`
  *[_type == "annualReport" && published == true] | order(year desc) {
    _id, year, title, summary, highlights,
    coverImage { asset->{ url } },
    file { asset->{ url } }
  }
`