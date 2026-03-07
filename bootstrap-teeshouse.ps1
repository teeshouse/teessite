# ============================================================
# Tee's House — Phase 1 Bootstrap Script
# Run from: C:\Users\MikeArbrouet\teessite\
# ============================================================

Write-Host "🌱 Bootstrapping Tee's House project..." -ForegroundColor Green

# ── Helper function ──────────────────────────────────────────
function Write-File {
    param([string]$Path, [string]$Content)
    $dir = Split-Path $Path -Parent
    if ($dir -and !(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.Encoding]::UTF8)
    Write-Host "  created: $Path" -ForegroundColor Cyan
}

# ── package.json ─────────────────────────────────────────────
Write-File "package.json" @'
{
  "name": "teessite",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "@sanity/client": "^6.21.3",
    "@sanity/image-url": "^1.0.2",
    "next-sanity": "^9.4.2",
    "@supabase/supabase-js": "^2.45.4",
    "resend": "^4.0.0",
    "lucide-react": "^0.441.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.5"
  }
}
'@

# ── .gitignore ───────────────────────────────────────────────
Write-File ".gitignore" @'
/node_modules
/.next/
/out/
/build
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.vercel
*.tsbuildinfo
next-env.d.ts
'@

# ── .env.local.example ───────────────────────────────────────
Write-File ".env.local.example" @'
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# Notifications
NOTIFICATION_EMAIL=info@teeshouse.org

# PayPal Giving Fund
NEXT_PUBLIC_PAYPAL_DONATE_URL=
'@

# ── tsconfig.json ────────────────────────────────────────────
Write-File "tsconfig.json" @'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
'@

# ── next.config.ts ───────────────────────────────────────────
Write-File "next.config.ts" @'
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      { protocol: "https", hostname: "www.teeshouse.org", pathname: "/wp-content/**" }
    ]
  }
}

export default nextConfig
'@

# ── postcss.config.mjs ───────────────────────────────────────
Write-File "postcss.config.mjs" @'
const config = {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
export default config
'@

# ── tailwind.config.ts ───────────────────────────────────────
Write-File "tailwind.config.ts" @'
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "green": {
          dark:  "#2D5016",
          mid:   "#4A7C2F",
          light: "#EAF2E3",
          pale:  "#F4FAF0"
        },
        "amber": {
          DEFAULT: "#C8860A",
          light:   "#FDF3DC",
          dark:    "#9E6A08"
        },
        "earth": {
          brown: "#5C3D1E",
          tan:   "#D4B896",
          cream: "#FBF6EF"
        },
        "gray": {
          body:   "#444444",
          muted:  "#6B7280",
          border: "#E5E7EB",
          light:  "#F9FAFB"
        }
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Lora", "Georgia", "serif"]
      },
      spacing: {
        section:    "5rem",
        "section-sm": "3rem"
      },
      borderRadius: { card: "0.75rem" },
      boxShadow: {
        card:       "0 2px 12px rgba(45,80,22,0.08)",
        "card-hover": "0 8px 30px rgba(45,80,22,0.15)",
        cta:        "0 4px 20px rgba(200,134,10,0.25)"
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: { "fade-up": "fadeUp 0.6s ease-out forwards" }
    }
  },
  plugins: []
}

export default config
'@

# ── README.md ────────────────────────────────────────────────
Write-File "README.md" @'
# Tee's House Inc. — Website

Built pro bono as a community contribution to Tee's House Inc., Pensacola FL.

## Stack
Next.js 14 + TypeScript + Tailwind + Sanity CMS + Supabase + Vercel

## Dev
```bash
npm install
npm run dev
```

## Deploy
Push to main -> Vercel auto-deploys.
'@

# ── src/types/index.ts ───────────────────────────────────────
Write-File "src/types/index.ts" @'
export interface SanityImage {
  _type: "image"
  asset: { _ref: string; _type: "reference" }
  alt?: string
}

export interface SanitySlug {
  _type: "slug"
  current: string
}

export type ProgramStatus = "current" | "past" | "upcoming"

export interface Program {
  _id: string
  title: string
  slug: SanitySlug
  status: ProgramStatus
  year: number
  category: string
  description: any[]
  image?: SanityImage
  featured: boolean
}

export interface NewsPost {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt: string
  excerpt: string
  body: any[]
  featuredImage?: SanityImage
  tags?: string[]
  featured: boolean
}

export interface VolunteerRole {
  _id: string
  title: string
  icon: string
  description: string
  responsibilities?: string[]
  active: boolean
  order: number
}

export interface SiteSettings {
  heroHeadline: string
  heroSubtext: string
  missionTagline: string
  phone: string
  email: string
  address: string
  facebookUrl?: string
  instagramUrl?: string
  paypalDonateLink?: string
}

export interface ImpactStat {
  _id: string
  label: string
  value: string
  icon: string
  order: number
}

export interface VolunteerApplication {
  name: string
  email: string
  phone?: string
  role_interest: string[]
  availability: string
  message?: string
}

export interface ContactSubmission {
  name: string
  email: string
  subject?: string
  message: string
}
'@

# ── src/lib/sanity.ts ────────────────────────────────────────
Write-File "src/lib/sanity.ts" @'
import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import type { SanityImage } from "@/types"

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN
})

const builder = imageUrlBuilder(sanityClient)
export function urlFor(source: SanityImage) {
  return builder.image(source)
}

export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]`)
}

export async function getFeaturedPrograms() {
  return sanityClient.fetch(`
    *[_type == "program" && featured == true] | order(_createdAt desc)[0...3] {
      _id, title, slug, status, category, description, image
    }
  `)
}

export async function getAllPrograms() {
  return sanityClient.fetch(`
    *[_type == "program"] | order(year desc) {
      _id, title, slug, status, year, category, description, image, featured
    }
  `)
}

export async function getProgramBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "program" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getFeaturedNews() {
  return sanityClient.fetch(`
    *[_type == "news" && featured == true] | order(publishedAt desc)[0...3] {
      _id, title, slug, publishedAt, excerpt, featuredImage, tags
    }
  `)
}

export async function getAllNews() {
  return sanityClient.fetch(`
    *[_type == "news"] | order(publishedAt desc) {
      _id, title, slug, publishedAt, excerpt, featuredImage, tags, featured
    }
  `)
}

export async function getNewsBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "news" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getVolunteerRoles() {
  return sanityClient.fetch(`
    *[_type == "volunteerRole" && active == true] | order(order asc) {
      _id, title, icon, description, responsibilities, active, order
    }
  `)
}

export async function getImpactStats() {
  return sanityClient.fetch(`
    *[_type == "impactStat"] | order(order asc) {
      _id, label, value, icon, order
    }
  `)
}
'@

# ── src/lib/supabase.ts ──────────────────────────────────────
Write-File "src/lib/supabase.ts" @'
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function submitVolunteerApplication(data: {
  name: string; email: string; phone?: string
  role_interest: string[]; availability: string; message?: string
}) {
  const { error } = await supabase.from("volunteer_applications").insert([{ ...data, status: "new" }])
  if (error) throw error
  return { success: true }
}

export async function submitContactForm(data: {
  name: string; email: string; subject?: string; message: string
}) {
  const { error } = await supabase.from("contact_submissions").insert([{ ...data, status: "new" }])
  if (error) throw error
  return { success: true }
}

export async function submitNewsletterSignup(data: {
  email: string; first_name?: string; source?: string
}) {
  const { error } = await supabase.from("newsletter_signups").insert([{ ...data, active: true }])
  if (error) throw error
  return { success: true }
}
'@

# ── src/lib/resend.ts ────────────────────────────────────────
Write-File "src/lib/resend.ts" @'
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const TO   = process.env.NOTIFICATION_EMAIL || "info@teeshouse.org"
const FROM = "Tee'\''s House Website <noreply@teeshouse.org>"

export async function sendVolunteerNotification(data: {
  name: string; email: string; role_interest: string[]
  availability: string; message?: string
}) {
  await resend.emails.send({
    from: FROM, to: TO,
    subject: `New Volunteer Application - ${data.name}`,
    html: `<h2>New Volunteer Application</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Roles:</strong> ${data.role_interest.join(", ")}</p>
      <p><strong>Availability:</strong> ${data.availability}</p>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}`
  })
}

export async function sendContactNotification(data: {
  name: string; email: string; subject?: string; message: string
}) {
  await resend.emails.send({
    from: FROM, to: TO,
    subject: `New Contact Message - ${data.subject || "General Inquiry"}`,
    html: `<h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject || "—"}</p>
      <p><strong>Message:</strong> ${data.message}</p>`
  })
}
'@

# ── src/app/globals.css ──────────────────────────────────────
Write-File "src/app/globals.css" @'
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply font-sans text-gray-body bg-white antialiased; }
  h1,h2,h3,h4,h5,h6 { @apply font-display; }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 bg-green-dark text-white font-semibold
           px-6 py-3 rounded-lg hover:bg-green-mid transition-all duration-200 shadow-card
           focus:outline-none focus:ring-2 focus:ring-green-mid focus:ring-offset-2;
  }
  .btn-amber {
    @apply inline-flex items-center justify-center gap-2 bg-amber text-white font-semibold
           px-6 py-3 rounded-lg hover:bg-amber-dark transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2;
  }
  .btn-outline {
    @apply inline-flex items-center justify-center gap-2 border-2 border-green-dark text-green-dark
           font-semibold px-6 py-3 rounded-lg hover:bg-green-dark hover:text-white transition-all duration-200;
  }
  .btn-outline-white {
    @apply inline-flex items-center justify-center gap-2 border-2 border-white text-white
           font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-green-dark transition-all duration-200;
  }
  .card {
    @apply bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300;
  }
  .section-padding    { @apply py-section px-4 md:px-8; }
  .section-padding-sm { @apply py-section-sm px-4 md:px-8; }
  .container-max      { @apply max-w-6xl mx-auto; }
  .form-input {
    @apply w-full px-4 py-3 rounded-lg border border-gray-border text-gray-body bg-white
           focus:outline-none focus:ring-2 focus:ring-green-mid focus:border-transparent
           placeholder:text-gray-muted transition-all duration-200;
  }
  .form-label { @apply block text-sm font-semibold text-gray-body mb-1; }
  .badge-current  { @apply inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-light text-green-dark; }
  .badge-past     { @apply inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-light text-gray-muted; }
  .badge-upcoming { @apply inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-light text-amber-dark; }
}
'@

# ── src/app/layout.tsx ───────────────────────────────────────
Write-File "src/app/layout.tsx" @'
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.teeshouse.org"),
  title: {
    default: "Tee'\''s House Inc. | Empowering Communities in Northwest Florida",
    template: "%s | Tee'\''s House Inc."
  },
  description: "Tee'\''s House Inc. is a Pensacola-based nonprofit empowering communities through food access, youth development, mental health support, and creative expression.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.teeshouse.org",
    siteName: "Tee'\''s House Inc."
  }
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Tee'\''s House Inc.",
  "url": "https://www.teeshouse.org",
  "description": "Empowering communities in Northwest Florida through food access, youth development, and creative expression.",
  "address": { "@type": "PostalAddress", "addressLocality": "Pensacola", "addressRegion": "FL" },
  "telephone": "850-291-1888",
  "email": "info@teeshouse.org"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
'@

# ── src/app/page.tsx ─────────────────────────────────────────
Write-File "src/app/page.tsx" @'
import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Leaf, Heart, Users, Sprout, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Tee'\''s House Inc. | Empowering Communities in Northwest Florida"
}

const featureCards = [
  { icon: Heart,  title: "Giving Back",  href: "/donate",    description: "Time, finances, or food are ways to help our organization and the community.", color: "amber" },
  { icon: Sprout, title: "Our Programs", href: "/programs",  description: "Cultivating creativity, education, and community growth through hands-on programs.", color: "green" },
  { icon: Users,  title: "Volunteer",    href: "/volunteer", description: "We welcome all with a sincere heart and a warm smile.", color: "amber" }
]

const impactStats = [
  { value: "500+", label: "Meals Provided", icon: "🥗" },
  { value: "150+", label: "Youth Reached",  icon: "🌱" },
  { value: "80+",  label: "Volunteers",     icon: "🤝" },
  { value: "5+",   label: "Programs",       icon: "🎨" }
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(45,80,22,0.92) 0%, rgba(74,124,47,0.80) 100%)" }}>
          <div className="container-max text-center px-4 animate-fade-up">
            <div className="flex justify-center mb-4">
              <Leaf className="w-12 h-12 text-amber" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Empowering Minds,<br />
              <span className="text-amber">Nourishing Bodies,</span><br />
              Building Futures.
            </h1>
            <p className="text-lg md:text-xl text-green-light max-w-2xl mx-auto mb-8 leading-relaxed">
              Tee&apos;s House is a Pensacola-based nonprofit dedicated to uplifting communities
              through food access, youth development, and creative expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate"    className="btn-amber text-base px-8 py-4">Donate Today</Link>
              <Link href="/about"     className="btn-outline-white text-base px-8 py-4">Learn Our Story</Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20L0 60Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* MISSION TAGLINE */}
        <section className="py-12 bg-white">
          <div className="container-max px-4 text-center">
            <p className="font-display text-2xl md:text-3xl text-green-dark italic max-w-3xl mx-auto">
              &ldquo;Real change starts at the grassroots level — with neighbors helping neighbors.&rdquo;
            </p>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="section-padding bg-green-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-green-dark mb-3">How You Can Help</h2>
              <p className="text-gray-muted max-w-xl mx-auto">Every seed planted, every meal shared, every hour volunteered — it all grows into a stronger community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureCards.map((card) => {
                const Icon = card.icon
                return (
                  <Link key={card.title} href={card.href}
                    className="card p-8 text-center group hover:-translate-y-1 transition-transform duration-300">
                    <div className={`inline-flex p-4 rounded-full mb-4 ${card.color === "amber" ? "bg-amber-light" : "bg-green-light"}`}>
                      <Icon className={`w-8 h-8 ${card.color === "amber" ? "text-amber" : "text-green-mid"}`} />
                    </div>
                    <h3 className="text-green-dark mb-3 group-hover:text-green-mid transition-colors">{card.title}</h3>
                    <p className="text-gray-muted text-sm leading-relaxed mb-4">{card.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber group-hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* IMPACT STATS */}
        <section className="section-padding bg-green-dark text-white">
          <div className="container-max">
            <div className="text-center mb-10">
              <h2 className="text-white mb-3">Our Impact</h2>
              <p className="text-green-light">Growing stronger every year — together.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="font-display text-4xl font-bold text-amber mb-1">{stat.value}</div>
                  <div className="text-green-light text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Our Mission</span>
                <h2 className="text-green-dark mt-2 mb-4">Building a Brighter Future Together</h2>
                <p className="text-gray-muted leading-relaxed mb-4">
                  Tee&apos;s House Inc. empowers communities in Northwest Florida by addressing food insecurity,
                  fostering educational growth, and promoting mental well-being.
                </p>
                <p className="text-gray-muted leading-relaxed mb-6">
                  Through agricultural programs and holistic support, we build resilience, independence,
                  and a brighter future for individuals and families.
                </p>
                <Link href="/about" className="btn-primary">
                  Our Full Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-green-light rounded-card p-8 space-y-4">
                {[
                  { emoji: "🌻", title: "Community Gardens",  desc: "Growing food and teaching self-sufficiency" },
                  { emoji: "🎭", title: "Creative Arts & Youth", desc: "Art, drama, and poetry for youth expression" },
                  { emoji: "🤝", title: "Community Outreach", desc: "Food, resources, and education for all" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div>
                      <h3 className="text-green-dark text-base mb-1">{item.title}</h3>
                      <p className="text-gray-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding-sm bg-amber">
          <div className="container-max text-center px-4">
            <h2 className="text-white mb-3">Ready to Make a Difference?</h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">Whether you donate, volunteer, or spread the word — every act of kindness plants a seed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate"    className="btn-outline-white text-base px-8 py-4">Donate Now</Link>
              <Link href="/volunteer" className="bg-white text-amber font-semibold px-8 py-4 rounded-lg hover:bg-amber-light transition-colors">Volunteer With Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
'@

# ── src/components/Navbar.tsx ────────────────────────────────
Write-File "src/components/Navbar.tsx" @'
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Leaf } from "lucide-react"

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "About Us",     href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Giving Back",  href: "/donate" },
  { label: "Volunteer",    href: "/volunteer" },
  { label: "News",         href: "/news" },
  { label: "Contact",      href: "/contact" }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-green-dark text-white sticky top-0 z-50 shadow-md">
      <div className="container-max flex items-center justify-between h-16 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl hover:text-amber transition-colors">
          <Leaf className="w-6 h-6 text-amber" />
          <span>Tee&apos;s House</span>
        </Link>
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${pathname === link.href ? "bg-green-mid text-white" : "text-green-light hover:bg-green-mid hover:text-white"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/donate" className="ml-3 btn-amber text-sm px-4 py-2">Donate</Link>
        </div>
        <button className="lg:hidden p-2 rounded-md hover:bg-green-mid transition-colors"
          onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-green-dark border-t border-green-mid px-4 pb-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`block px-3 py-3 rounded-md text-sm font-medium transition-colors
                ${pathname === link.href ? "bg-green-mid text-white" : "text-green-light hover:bg-green-mid"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/donate" onClick={() => setOpen(false)}
            className="block mt-3 btn-amber text-center text-sm">Donate Now</Link>
        </div>
      )}
    </nav>
  )
}
'@

# ── src/components/Footer.tsx ────────────────────────────────
Write-File "src/components/Footer.tsx" @'
import Link from "next/link"
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react"

const footerLinks = [
  { label: "About Us",     href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Giving Back",  href: "/donate" },
  { label: "Volunteer",    href: "/volunteer" },
  { label: "News",         href: "/news" },
  { label: "Contact",      href: "/contact" }
]

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white mt-auto">
      <div className="container-max section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl mb-3">
              <Leaf className="w-6 h-6 text-amber" />
              <span>Tee&apos;s House Inc.</span>
            </div>
            <p className="text-green-light text-sm leading-relaxed">
              Empowering minds, nourishing bodies, and building futures in Northwest Florida.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-mid hover:bg-amber transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-mid hover:bg-amber transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-display font-semibold text-amber mb-3 text-base">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-green-light text-sm hover:text-amber transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold text-amber mb-3 text-base">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-green-light">
                <MapPin className="w-4 h-4 mt-0.5 text-amber shrink-0" />Pensacola, Florida
              </li>
              <li>
                <a href="tel:8502911888" className="flex items-center gap-2 text-sm text-green-light hover:text-amber transition-colors">
                  <Phone className="w-4 h-4 text-amber" />850.291.1888
                </a>
              </li>
              <li>
                <a href="mailto:info@teeshouse.org" className="flex items-center gap-2 text-sm text-green-light hover:text-amber transition-colors">
                  <Mail className="w-4 h-4 text-amber" />info@teeshouse.org
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/donate" className="btn-amber text-sm px-5 py-2">Donate Now</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-green-mid mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-green-light">
          <p>© {new Date().getFullYear()} Tee&apos;s House Inc. All rights reserved.</p>
          <p className="text-center">Tee&apos;s House Inc. is a registered 501(c)(3) nonprofit organization. Donations are tax-deductible to the extent permitted by law.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-amber transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
'@

# ── Stub pages ───────────────────────────────────────────────
$stubs = @("about","programs","donate","volunteer","news","contact")
foreach ($page in $stubs) {
    Write-File "src/app/$page/page.tsx" @"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="section-padding container-max mx-auto px-4">
        <h1 className="text-green-dark capitalize">$page</h1>
        <p className="text-gray-muted mt-4">Coming soon — Phase 3 build.</p>
      </main>
      <Footer />
    </>
  )
}
"@
}

Write-Host ""
Write-Host "✅ All files created! Now run:" -ForegroundColor Green
Write-Host "   npm install" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m 'Phase 1: Next.js 14 scaffold'" -ForegroundColor Yellow
Write-Host "   git push origin main" -ForegroundColor Yellow
