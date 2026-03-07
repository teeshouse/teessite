import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.teeshouse.org"),
  title: {
    default: "Tees House Inc. | Empowering Communities in Northwest Florida",
    template: "%s | Tees House Inc."
  },
  description: "Tees House Inc. is a Pensacola-based nonprofit empowering communities through food access, youth development, mental health support, and creative expression.",
  openGraph: { type: "website", locale: "en_US", url: "https://www.teeshouse.org", siteName: "Tees House Inc." }
}

const sd = {
  "@context": "https://schema.org", "@type": "NGO",
  "name": "Tees House Inc.", "url": "https://www.teeshouse.org",
  "description": "Empowering communities in Northwest Florida.",
  "address": { "@type": "PostalAddress", "addressLocality": "Pensacola", "addressRegion": "FL" },
  "telephone": "850-291-1888", "email": "info@teeshouse.org"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sd) }} />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}