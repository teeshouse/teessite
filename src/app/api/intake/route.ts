import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyInfo } from "@/lib/resend"
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, phone,
      address, city, state, zip,
      interests, referralSource, goals, notes,
    } = body

    // Honeypot
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true, message: "Form received! We will be in touch soon." })
    }

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Rate limit: 3 per 5 minutes
    const ip = getClientIp(req)
    const gate = checkRateLimit(`intake:${ip}`, { limit: 3, windowMs: 5 * 60_000 })
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a few minutes and try again." },
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
      .from("intake_submissions")
      .insert([{
        name,
        email,
        phone:           phone || null,
        address:         address || null,
        city:            city || null,
        state:           state || null,
        zip:             zip || null,
        interests:       interests || [],
        referral_source: referralSource || null,
        goals:           goals || null,
        notes:           notes || null,
        status:          "new",
      }])

    if (dbError) {
      console.error("Supabase insert error:", JSON.stringify(dbError))
      return NextResponse.json({ error: "Failed to submit form. Please try again." }, { status: 500 })
    }

    await notifyInfo({
      subject: `New client intake: ${name}`,
      intro:   "A new client intake form was submitted.",
      fields: [
        { label: "Name",     value: name },
        { label: "Email",    value: email },
        { label: "Phone",    value: phone || "(none)" },
        { label: "Location", value: [address, city, state, zip].filter(Boolean).join(", ") || "(none)" },
        { label: "Interests", value: (interests || []).join(", ") || "(none)" },
        { label: "Referral", value: referralSource || "(none)" },
      ],
      body: [
        goals ? `Goals:\n${goals}` : "",
        notes ? `Notes:\n${notes}` : "",
      ].filter(Boolean).join("\n\n") || undefined,
    })

    return NextResponse.json({ success: true, message: "Form received! We will be in touch soon." })

  } catch (err) {
    console.error("Intake API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
