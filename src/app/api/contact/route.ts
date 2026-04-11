import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyInfo } from "@/lib/resend"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert([{
        name,
        email,
        subject: subject || null,
        message,
        status: "new"
      }])

    if (dbError) {
      console.error("Supabase insert error:", JSON.stringify(dbError))
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
    }

    // Fire-and-forget email notification. Intentionally awaited so failures
    // are logged, but its return value never affects the user-facing response.
    await notifyInfo({
      subject: `New contact form: ${subject || "(no subject)"}`,
      replyTo: email,
      intro:   `A new message was submitted through the contact form.`,
      fields: [
        { label: "Name",    value: name },
        { label: "Email",   value: email },
        { label: "Subject", value: subject || "(none)" },
      ],
      body: message,
    })

    return NextResponse.json({ success: true, message: "Message sent! We will get back to you soon." })

  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}