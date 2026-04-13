import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  try {
    // Revalidate every CMS-driven page so Sanity publishes are
    // reflected immediately instead of waiting for ISR expiry.
    const paths = [
      "/",
      "/community-impact",
      "/news",
      "/about",
      "/events",
      "/gallery",
      "/donate",
      "/volunteer",
      "/partners",
      "/faq",
      "/transparency",
      "/contact",
      "/services",
      "/intake",
    ]
    paths.forEach(p => revalidatePath(p))

    // Also revalidate dynamic slug routes (layout-level revalidation
    // covers all children, so /news/[slug] and /pages/[slug] are
    // covered by the layout revalidation for /news and /pages).
    revalidatePath("/news", "layout")
    revalidatePath("/pages", "layout")

    return NextResponse.json({ revalidated: true, paths, timestamp: Date.now() })
  } catch (err) {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 })
  }
}