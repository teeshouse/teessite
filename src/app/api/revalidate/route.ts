import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  try {
    // Revalidate all CMS-driven pages
    revalidatePath("/")
    revalidatePath("/programs")
    revalidatePath("/news")
    revalidatePath("/about")
    revalidatePath("/volunteer")
    revalidatePath("/donate")
    return NextResponse.json({ revalidated: true, timestamp: Date.now() })
  } catch (err) {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 })
  }
}