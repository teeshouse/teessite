import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sendUserEmail, notifyInfo } from "@/lib/resend"
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit"
import { isMinor, generateParentToken, parentTokenExpiresAt } from "@/lib/mentorship/consent-token"
import { parentConsentRequest, applicantConfirmation } from "@/lib/mentorship/email-templates"

const SITE_URL = process.env.SITE_URL || "https://teeshouse.org"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      firstName, lastName, email, phone,
      dateOfBirth, gradeLevel,
      interests, lookingFor, availability, bio,
      parentName, parentEmail,
      agreedToTerms,
    } = body

    // Honeypot: silently accept bot submissions so they don't retry.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true, message: "Application received!" })
    }

    if (!firstName || !lastName || !email || !dateOfBirth || !agreedToTerms) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Server-side age computation is the source of truth — never trust a
    // client-sent is_minor flag.
    const minor = isMinor(dateOfBirth)

    if (minor && (!parentName || !parentEmail)) {
      return NextResponse.json(
        { error: "Parent/guardian name and email are required for applicants under 18" },
        { status: 400 }
      )
    }

    const ip = getClientIp(req)
    const gate = checkRateLimit(`mentee-apply:${ip}`, { limit: 3, windowMs: 10 * 60_000 })
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many applications. Please wait a few minutes and try again." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } }
      )
    }

    const { data: inserted, error: dbError } = await supabaseAdmin
      .from("mentorship_applications")
      .insert([{
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        grade_level: gradeLevel || null,
        areas_of_interest: interests || [],
        looking_for: lookingFor || [],
        availability: availability || [],
        bio: bio || null,
        date_of_birth: dateOfBirth,
        is_minor: minor,
        parent_name: minor ? parentName : null,
        parent_email: minor ? parentEmail : null,
        agreed_to_terms: true,
        agreed_at: new Date().toISOString(),
        status: "pending",
      }])
      .select("id")
      .single()

    if (dbError || !inserted) {
      console.error("Supabase insert error:", JSON.stringify(dbError))
      if (dbError?.code === "23505") {
        return NextResponse.json({ error: "An application with this email already exists." }, { status: 400 })
      }
      return NextResponse.json({ error: "Failed to save application. Please try again." }, { status: 500 })
    }

    if (minor) {
      const parentToken = generateParentToken()
      await supabaseAdmin
        .from("mentorship_applications")
        .update({ parent_token: parentToken, parent_token_expires_at: parentTokenExpiresAt() })
        .eq("id", inserted.id)

      const consentUrl = `${SITE_URL}/mentorship/consent/${parentToken}`
      const email_ = parentConsentRequest({
        parentName,
        applicantName: `${firstName} ${lastName}`,
        consentUrl,
      })
      await sendUserEmail({ to: parentEmail, ...email_ })
    } else {
      const email_ = applicantConfirmation({ firstName })
      await sendUserEmail({ to: email, ...email_ })
    }

    await notifyInfo({
      subject: `New mentee application: ${firstName} ${lastName}`,
      intro: "A new mentorship applicant was submitted.",
      fields: [
        { label: "Name", value: `${firstName} ${lastName}` },
        { label: "Email", value: email },
        { label: "Phone", value: phone || "(none)" },
        { label: "Grade Level", value: gradeLevel || "(none)" },
        { label: "Minor?", value: minor ? `Yes — awaiting parent consent (${parentEmail})` : "No" },
        { label: "Interests", value: (interests || []).join(", ") || "(none)" },
      ],
      body: bio || undefined,
    })

    return NextResponse.json({
      success: true,
      message: minor ? "Application received! We've emailed your parent/guardian for consent." : "Application received!",
    })
  } catch (err) {
    console.error("Mentorship apply API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
