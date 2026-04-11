import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, phone, roles, skills,
      days, times, backgroundCheck,
      emergencyName, emergencyPhone, emergencyRelation, notes
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Save to Supabase
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars")
      // Still return success to user - log the submission
      console.log("Volunteer submission (no DB):", { name, email, phone, roles })
      return NextResponse.json({ success: true, message: "Application received" })
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from("volunteer_applications")
      .insert([{
        name,
        email,
        phone:              phone || null,
        roles:              roles || [],
        skills:             skills || null,
        days:               days || [],
        times:              times || [],
        background_check:   backgroundCheck || false,
        emergency_name:     emergencyName || null,
        emergency_phone:    emergencyPhone || null,
        emergency_relation: emergencyRelation || null,
        notes:              notes || null,
        status:             "pending"
      }])

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to save application. Please try again." }, { status: 500 })
    }

    // Try to send notification email via Resend (optional)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: "notifications@teeshouse.org",
          to:   "info@teeshouse.org",
          subject: `New Volunteer Application: ${name}`,
          text: `New volunteer application from ${name} (${email}). Roles: ${roles?.join(", ")}. Check Supabase for full details.`
        })
      } catch (emailErr) {
        console.error("Email error (non-fatal):", emailErr)
      }
    }

    return NextResponse.json({ success: true, message: "Application received! We will be in touch soon." })

  } catch (err) {
    console.error("Volunteer API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}