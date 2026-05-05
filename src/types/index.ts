export interface SanityImage {
  _type: "image"
  asset: { _ref: string; _type: "reference" }
  alt?: string
}
export interface SanitySlug { _type: "slug"; current: string }
export type ProgramStatus = "current" | "past" | "upcoming"
export interface Program {
  _id: string; title: string; slug: SanitySlug; status: ProgramStatus
  year: number; category: string; description: any[]; image?: SanityImage; featured: boolean
}
export interface NewsPost {
  _id: string; title: string; slug: SanitySlug; publishedAt: string
  excerpt: string; body: any[]; featuredImage?: SanityImage; tags?: string[]; featured: boolean
}
export interface VolunteerRole {
  _id: string; title: string; icon: string; description: string
  responsibilities?: string[]; active: boolean; order: number
}
export interface BeforeAfterSettings {
  beforeImage?: { asset?: { url?: string } }
  afterImage?:  { asset?: { url?: string } }
  beforeLabel?: string
  afterLabel?:  string
  caption?:     string
}
export interface ProgramsPageSettings {
  navLabel?:        string
  pageTitle?:       string
  pageKicker?:      string
  metaTitle?:       string
  metaDescription?: string
  homeHeroCta?:     string
  homeListCta?:     string
}
/** Reusable label set for simple top-level pages (About/Events/News/Gallery). */
export interface PageLabelFields {
  navLabel?:        string
  pageTitle?:       string
  pageKicker?:      string
  metaTitle?:       string
  metaDescription?: string
}
export interface PageLabelsSettings {
  about?:    PageLabelFields
  events?:   PageLabelFields
  news?:     PageLabelFields
  gallery?:  PageLabelFields
  partners?: PageLabelFields
}
export type PageLabelsKey = keyof PageLabelsSettings
export interface GivingOption {
  title: string; description?: string; buttonLabel?: string; url?: string; isExternal?: boolean
}
export interface MonthlyTier {
  amount: string; impact: string
}
export interface DonatePageSettings {
  fundraisingGoal?: number; fundraisingRaised?: number; fundraisingDonors?: number
  fundraisingLabel?: string; fundraisingDeadline?: string
  givingOptions?: GivingOption[]
  monthlyTiers?: MonthlyTier[]
}
export interface CoreValue { title: string; description: string }
export interface AboutPageSettings {
  missionHeading?: string
  missionBody?: any[]
  missionImage?: { asset?: { url?: string } }
  coreValues?: CoreValue[]
  contactQuote?: string
  contactImage?: { asset?: { url?: string } }
}
export interface HomePageSettings {
  parallaxHeading?: string; parallaxText?: string
  parallaxImage?: { asset?: { url?: string } }
  ctaHeading?: string; ctaText?: string
  heroImage?: { asset?: { url?: string } }
}
export interface Service {
  _id: string; title: string; description: string
  category: "kit" | "service"; price?: string
  image?: { asset?: { url?: string }; alt?: string }
  featured?: boolean; order?: number
}
export interface SiteSettings {
  heroHeadline: string; heroSubtext: string; missionTagline: string
  heroVideoUrl?: string
  beforeAfter?: BeforeAfterSettings
  programsPage?: ProgramsPageSettings
  pageLabels?: PageLabelsSettings
  donatePage?: DonatePageSettings
  aboutPage?: AboutPageSettings
  homePage?: HomePageSettings
  phone: string; email: string; address: string
  facebookUrl?: string; instagramUrl?: string; linkedinUrl?: string; paypalDonateLink?: string
}
export interface ImpactStat { _id: string; label: string; value: string; icon: string; order: number }
export interface VolunteerApplication {
  name: string; email: string; phone?: string
  role_interest: string[]; availability: string; message?: string
}
export interface ContactSubmission { name: string; email: string; subject?: string; message: string }