import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sendUserEmail, notifyInfo } from "@/lib/resend"
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit"
import { applicantConfirmation } from "@/lib/mentorship/email-templates"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      firstName, lastName, email, phone,
      company, jobTitle, location, bio,
      expertise, mentoringStyle, availability,
      agreedToTerms, backgroundSelfCert,
    } = body

    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true, message: "Application received!" })
    }

    if (!firstName || !lastName || !email || !phone || !bio || !agreedToTerms || !backgroundSelfCert) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ip = getClientIp(req)
    const gate = checkRateLimit(`mentor-apply:${ip}`, { limit: 3, windowMs: 10 * 60_000 })
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many applications. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } }
      )
    }

    const { error: dbError } = await supabaseAdmin
      .from("mentors")
      .insert([{
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company: company || null,
        job_title: jobTitle || null,
        location: location || null,
        bio,
        areas_of_expertise: expertise || [],
        mentoring_style: mentoringStyle || [],
        availability: availability || [],
        agreed_to_terms: true,
        agreed_at: new Date().toISOString(),
        background_self_cert: true,
        status: "pending",
      }])

    if (dbError) {
      console.error("Supabase insert error:", JSON.stringify(dbError))
      if (dbError.code === "23505") {
        return NextResponse.json({ error: "An application with this email already exists." }, { status: 400 })
      }
      return NextResponse.json({ error: "Failed to save application. Please try again." }, { status: 500 })
    }

    const email_ = applicantConfirmation({ firstName })
    await sendUserEmail({ to: email, ...email_ })

    await notifyInfo({
      subject: `New mentor application: ${firstName} ${lastName}`,
      intro: "A new mentor applicant was submitted.",
      fields: [
        { label: "Name", value: `${firstName} ${lastName}` },
        { label: "Email", value: email },
        { label: "Phone", value: phone },
        { label: "Company", value: company || "(none)" },
        { label: "Expertise", value: (expertise || []).join(", ") || "(none)" },
        { label: "Background self-cert", value: backgroundSelfCert ? "Yes" : "No" },
      ],
      body: bio,
    })

    return NextResponse.json({ success: true, message: "Application received!" })
  } catch (err) {
    console.error("Mentor apply API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
