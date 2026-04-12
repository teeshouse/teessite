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
export interface SiteSettings {
  heroHeadline: string; heroSubtext: string; missionTagline: string
  heroVideoUrl?: string
  beforeAfter?: BeforeAfterSettings
  programsPage?: ProgramsPageSettings
  phone: string; email: string; address: string
  facebookUrl?: string; instagramUrl?: string; linkedinUrl?: string; paypalDonateLink?: string
}
export interface ImpactStat { _id: string; label: string; value: string; icon: string; order: number }
export interface VolunteerApplication {
  name: string; email: string; phone?: string
  role_interest: string[]; availability: string; message?: string
}
export interface ContactSubmission { name: string; email: string; subject?: string; message: string }