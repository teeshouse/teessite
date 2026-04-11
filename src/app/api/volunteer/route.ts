import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyInfo } from "@/lib/resend"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, phone, roles, skills,
      days, times, backgroundCheck,
      emergencyName, emergencyPhone, emergencyRelation, notes
    } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error: dbError } = await supabase
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

    if (dbError) {
      console.error("Supabase insert error:", JSON.stringify(dbError))
      return NextResponse.json({ error: "Failed to save application. Please try again." }, { status: 500 })
    }

    const skillsAndNotes = [
      skills ? `Skills / experience:\n${skills}` : "",
      notes  ? `Additional notes:\n${notes}`     : "",
    ].filter(Boolean).join("\n\n")

    await notifyInfo({
      subject: `New volunteer application: ${name}`,
      replyTo: email,
      intro:   `A new volunteer application was submitted.`,
      fields: [
        { label: "Name",       value: name },
        { label: "Email",      value: email },
        { label: "Phone",      value: phone || "(none)" },
        { label: "Roles",      value: (roles || []).join(", ") || "(none)" },
        { label: "Days",       value: (days  || []).join(", ") || "(none)" },
        { label: "Times",      value: (times || []).join(", ") || "(none)" },
        { label: "BG check",   value: backgroundCheck ? "Yes" : "Not answered" },
        { label: "Emergency",  value: `${emergencyName || "-"} / ${emergencyPhone || "-"} (${emergencyRelation || "-"})` },
      ],
      body: skillsAndNotes || undefined,
    })

    return NextResponse.json({ success: true, message: "Application received! We will be in touch soon." })

  } catch (err) {
    console.error("Volunteer API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}