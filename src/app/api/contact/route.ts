import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { submitContactForm } = await import("@/lib/supabase")
      await submitContactForm({ name, email, subject, message })
    }

    // Resend
    if (process.env.RESEND_API_KEY) {
      const { sendContactNotification } = await import("@/lib/resend")
      await sendContactNotification({ name, email, subject, message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}