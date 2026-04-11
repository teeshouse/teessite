import { NextRequest, NextResponse } from "next/server"

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
      console.log("Contact submission (no DB):", { name, email, subject, message })
      return NextResponse.json({ success: true, message: "Message received" })
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from("contact_submissions")
      .insert([{ name, email, subject: subject || null, message, status: "new" }])

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: "notifications@teeshouse.org",
          to:   "info@teeshouse.org",
          subject: `New Contact: ${subject || "General Inquiry"} from ${name}`,
          text: `From: ${name} (${email})\n\n${message}`
        })
      } catch (emailErr) {
        console.error("Email error (non-fatal):", emailErr)
      }
    }

    return NextResponse.json({ success: true, message: "Message sent! We will get back to you soon." })

  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}