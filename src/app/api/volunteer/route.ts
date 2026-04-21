import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyInfo } from "@/lib/resend"
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, phone, roles, skills,
      days, times, backgroundCheck,
      emergencyName, emergencyPhone, emergencyRelation, notes
    } = body

    // Honeypot: silently accept bot submissions so they don't retry.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true, message: "Application received! We will be in touch soon." })
    }

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Rate limit: 3 volunteer applications per 5 minutes per IP. Tighter
    // than contact because this form is much longer and nobody legitimately
    // submits it multiple times in quick succession.
    const ip = getClientIp(req)
    const gate = checkRateLimit(`volunteer:${ip}`, { limit: 3, windowMs: 5 * 60_000 })
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many applications. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } }
      )
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