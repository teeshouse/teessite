import { NextRequest, NextResponse } from "next/server"
import { submitContactForm } from "@/lib/supabase"
import { sendContactNotification } from "@/lib/resend"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await submitContactForm({ name, email, subject, message })
    await sendContactNotification({ name, email, subject, message })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}