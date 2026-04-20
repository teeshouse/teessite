# Tee's House Website — Developer Guide

## Project Overview

Non-profit website for Tee's House, a community organization founded by Tierra Arbrouet.
Built with Next.js 14 App Router, Sanity CMS, Supabase, and deployed on Vercel.

**Live site:** https://teeshouse.org (or Vercel preview URL)
**Sanity Studio:** https://teeshouse.sanity.studio (run `npx sanity deploy` from `teeshouse-studio/`)
**GitHub (site):** https://github.com/teeshouse/teessite
**GitHub (studio):** https://github.com/minher1/teeshouse-studio

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router (TypeScript) |
| Styling | Tailwind CSS |
| CMS | Sanity v3 (hosted, project ID: `zbeb0ctt`) |
| Database | Supabase (donor wall, contact form submissions) |
| Email | Resend (contact/volunteer/intake form notifications) |
| Deployment | Vercel (auto-deploy on push to `main`) |
| Studio | Separate repo `teeshouse-studio` |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values. Never commit `.env.local`.

```
NEXT_PUBLIC_SANITY_PROJECT_ID=zbeb0ctt
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=            # Sanity read token (from sanity.io/manage)
NEXT_PUBLIC_SUPABASE_URL=    # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=   # Supabase service role key (server only)
RESEND_API_KEY=              # Resend API key
NOTIFICATION_EMAIL=info@teeshouse.org
SANITY_REVALIDATE_SECRET=    # Secret for webhook-triggered cache busting
NEXT_PUBLIC_PAYPAL_DONATE_URL=  # PayPal donation link (optional)
```

All these must also be set in the **Vercel dashboard** under Project → Settings → Environment Variables.

---

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Home (/)
    about/                # About page
    community-impact/     # Programs/initiatives list
    news/                 # News listing + [slug] detail
    events/               # Events listing
    gallery/              # Photo gallery albums
    donate/               # Donate page (thermometer, giving options)
    volunteer/            # Volunteer signup form
    intake/               # Client intake form
    contact/              # Contact page
    services/             # Services + kit showcase + downloads
    transparency/         # Annual reports + downloads
    faq/                  # FAQ accordion
    partners/             # Partners grid
    pages/[slug]/         # CMS-driven custom pages
    api/
      revalidate/         # POST endpoint for Sanity webhook cache busting
      contact/            # Email submission handler
      volunteer/          # Volunteer form handler
      intake/             # Client intake form handler
      donate/             # Supabase donor wall handler

  components/
    Navbar.tsx            # Server component — nav data
    NavbarClient.tsx      # "use client" — dropdown state, mobile menu
    Footer.tsx            # Server component
    ContactForm.tsx       # "use client" — contact form
    VolunteerForm.tsx     # "use client" — volunteer form
    IntakeForm.tsx        # "use client" — client intake form
    PortableTextBody.tsx  # Renders Sanity block content (rich text)
    BeforeAfterSlider.tsx # Before/after image slider
    ParallaxSection.tsx   # Parallax scroll section
    DonationThermometer.tsx  # Fundraising progress bar
    AnimatedCounter.tsx   # Counting number animation
    VideoHero.tsx         # Hero video section

  lib/
    sanity.ts             # createClient setup
    sanity.client.ts      # Client-side Sanity client
    sanity.fetch.ts       # All data-fetching functions (getX())
    sanity.queries.ts     # All GROQ queries
    supabase.ts           # Supabase client
    resend.ts             # Resend email client
    volunteerRoles.ts     # Volunteer roles array (plain module, not "use client")
    rateLimit.ts          # Simple rate limiting for API routes

  types/
    index.ts              # TypeScript interfaces for all Sanity data shapes
```

---

## Critical Architecture Rules

### Server vs. Client Components

**NEVER** put `"use client"` at the top of a page file that also needs to:
- Import async server components (Navbar, Footer)
- Fetch data with `async/await` at the top level

**Pattern for pages with interactive forms:**
```
app/volunteer/page.tsx     ← Server component (no "use client")
  └─ imports VolunteerForm.tsx  ← "use client" (useState, form logic)
```

**Pattern for data fetching:**
```tsx
// page.tsx (server component — NO "use client")
import { getSiteSettings } from "@/lib/sanity.fetch"

export default async function Page() {
  const s = await getSiteSettings()
  return <div>{s.heroHeadline}</div>
}
```

### Adding a New Page

1. Create `src/app/your-page/page.tsx` (server component, fetch from Sanity)
2. Add nav link in `src/components/Navbar.tsx` (and `NavbarClient.tsx` for mobile)
3. Add path to revalidation list in `src/app/api/revalidate/route.ts`
4. If CMS-driven: add fields to `siteSettings` schema in studio, update `SITE_SETTINGS_QUERY`

### Adding a New Sanity Document Type

1. Create `schemas/yourType.ts` in `teeshouse-studio`
2. Register in `schemas/index.ts`
3. Add sidebar entry in `sanity.config.ts` (custom structure — it WILL NOT auto-appear)
4. Add GROQ query to `src/lib/sanity.queries.ts`
5. Add fetch function to `src/lib/sanity.fetch.ts`
6. Add TypeScript interface to `src/types/index.ts`
7. Deploy studio: `npx sanity deploy` (interactive terminal required)

---

## Sanity CMS

**Project ID:** `zbeb0ctt`  
**Dataset:** `production`  
**Studio URL:** https://teeshouse.sanity.studio

### Document Types

| Schema | Sidebar Label | Purpose |
|---|---|---|
| `siteSettings` | Site Settings | Global: hero, nav, contact, all page content |
| `program` | Community Impact | Programs/initiatives |
| `event` | Events | Events with date, registration, gallery |
| `news` | News / Blog | Blog posts with rich text |
| `teamMember` | Team | Staff/board members |
| `testimonial` | Testimonials | Quotes with attribution |
| `partner` | Partners | Partner org logos |
| `galleryAlbum` | Photo Gallery | Albums with multiple photos |
| `impactStat` | Impact Stats | Homepage stats (numbers) |
| `volunteerRole` | Volunteer Roles | Roles shown on volunteer page |
| `faq` | FAQ | Accordion questions |
| `annualReport` | Annual Reports | PDFs + highlights |
| `download` | Documents & Downloads | PDFs for services/transparency pages |
| `service` | Products & Services | Service tiers and kits |
| `page` | Custom Pages | CMS-driven pages at /pages/[slug] |

### Site Settings Fields

The `siteSettings` document is a single document that controls most of the site. Key sections:
- **Hero** — headline, subtext, video URL
- **Mission** — tagline on homepage
- **Contact** — phone, email, address
- **Social** — Facebook, Instagram, LinkedIn URLs
- **PayPal** — donation button link
- **Before/After** — slider images on homepage
- **Home Page** — parallax section, CTA banner, hero image
- **About Page** — mission content, core values, contact quote/image
- **Donate Page** — thermometer values, giving options, monthly tiers
- **Programs Page** — page labels (title, kicker, CTA text)
- **Page Labels** — title/kicker/meta for About, Events, News, Gallery pages

---

## Cache & Revalidation

Pages use ISR with `export const revalidate = 60` (1-minute fallback).

For **instant** updates when Tierra publishes in Sanity:
1. Sanity sends a webhook POST to `https://teeshouse.org/api/revalidate?secret=SANITY_REVALIDATE_SECRET`
2. The route handler calls `revalidatePath()` for all CMS-driven pages

**Webhook setup (Sanity):** sanity.io/manage → project → API → Webhooks  
URL: `https://your-domain.vercel.app/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`  
Trigger: On publish

---

## Deployment

Push to `main` → Vercel auto-deploys.

```bash
git add .
git commit -m "your message"
git push origin main
```

Studio changes require a separate deploy:
```bash
cd /path/to/teeshouse-studio
npx sanity deploy   # must be in an interactive terminal
```

---

## Forms & Email

All three forms (contact, volunteer, intake) post to `/api/[form]` routes which:
1. Rate-limit by IP
2. Send notification email via Resend to `NOTIFICATION_EMAIL`
3. Store submissions in Supabase

---

## Supabase Tables

- `donors` — donor wall (name, amount, message, anonymous flag)
- `contact_submissions` — contact form submissions
- `volunteer_applications` — volunteer form submissions
- `intake_submissions` — client intake form submissions

---

## Services Page

Tierra's actual service structure (hardcoded in `src/app/services/page.tsx` alongside CMS downloads):

**Service Tiers:**
- Tier 1: Workshops — $250/session (1.5–2hr, up to 30 participants)
- Tier 2: Program Support — $250/session + supplies (badge: "Most Popular")
- Tier 3: Program Implementation — Contact for Quote (Fall/Spring 6-month sessions)

**Kit Showcase (4 kits):**
- Growth with Confidence (Youth Leadership)
- Create & Bloom (Creative Arts)
- Grow & Glow (Wellness & Gardening)
- Thrive Monthly (Subscription Box)

---

## Key Contacts

- **Tierra Arbrouet** — Executive Director / client (tierra@teeshouse.org)
- **Mike Arbrouet** — Developer / builder
- **info@teeshouse.org** — Notification email for form submissions
