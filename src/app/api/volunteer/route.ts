import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyInfo } from "@/lib/resend"
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit"
import {
  HELP_ME_FIND_A_FIT, findFormOpportunity, opportunityBadge,
  daysOfWeek, timeSlots, bgOptions, creditOptions, educationOptions,
  RESUME_MAX_BYTES, RESUME_EXTENSIONS,
} from "@/lib/opportunities"

const oneLine = (v: unknown, max = 200) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : ""
const multiLine = (v: unknown, max = 5000) =>
  typeof v === "string" ? v.trim().slice(0, max) : ""
const pick = (v: unknown, allowed: string[]) =>
  Array.isArray(v) ? allowed.filter(a => v.includes(a)) : []
const oneOf = (v: unknown, allowed: string[]) =>
  typeof v === "string" && allowed.includes(v) ? v : ""

// First bytes of each allowed format, so a renamed file of another type is rejected.
const SIGNATURES: Record<string, number[]> = {
  pdf:  [0x25, 0x50, 0x44, 0x46],
  docx: [0x50, 0x4b, 0x03, 0x04],
  doc:  [0xd0, 0xcf, 0x11, 0xe0],
}

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    let body: Record<string, unknown> = {}
    try {
      const parsed = JSON.parse(String(form.get("payload") ?? "{}"))
      if (parsed && typeof parsed === "object") body = parsed
    } catch {
      return fail("Invalid submission.")
    }

    // Honeypot: silently accept bot submissions so they don't retry.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true, message: "Application received! We will be in touch soon." })
    }

    const name        = oneLine(body.name)
    const email       = oneLine(body.email)
    const phone       = oneLine(body.phone, 40)
    const otherRoles  = oneLine(body.otherRoles, 300)
    const statement   = multiLine(body.statement)
    const notes       = multiLine(body.notes)
    const days        = pick(body.days, daysOfWeek)
    const times       = pick(body.times, timeSlots)
    const education   = oneOf(body.education, educationOptions)
    const credit      = oneOf(body.academicCredit, creditOptions)
    const screening   = oneOf(body.backgroundCheck, bgOptions)

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail("Name and a valid email are required")
    }
    if (!days.length || !times.length) {
      return fail("Please complete all required fields.")
    }

    // The role must still be open on the website; a closed role is rejected even from a stale page.
    const isFitRequest = body.opportunityId === HELP_ME_FIND_A_FIT.id
    const opportunity  = isFitRequest ? undefined : findFormOpportunity(body.opportunityId)
    if (!isFitRequest && !opportunity) {
      return fail("That opportunity is no longer accepting applications. Please refresh the page and choose another.")
    }
    const roleTitle = opportunity ? opportunity.title : HELP_ME_FIND_A_FIT.title
    const roleType  = opportunity ? opportunityBadge(opportunity) : "General interest"

    // Optional résumé: only for internships and paid positions.
    let resume: { filename: string; content: Buffer } | undefined
    const file = form.get("resume")
    if (file && typeof file !== "string" && file.size > 0) {
      if (opportunity?.kind !== "internship" && opportunity?.kind !== "paid") {
        return fail("A résumé is not needed for this opportunity.")
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
      if (!RESUME_EXTENSIONS.includes(ext)) {
        return fail("Please upload your résumé as a PDF, DOC, or DOCX file.")
      }
      if (file.size > RESUME_MAX_BYTES) {
        return fail("Your résumé is too large. Please upload a file under 4 MB.")
      }
      const content = Buffer.from(await file.arrayBuffer())
      if (!SIGNATURES[ext].every((byte, i) => content[i] === byte)) {
        return fail("That file doesn't look like a valid PDF, DOC, or DOCX. Please check it and try again.")
      }
      const safeName = name.replace(/[^\w ]+/g, "").trim().slice(0, 60) || "Applicant"
      resume = { filename: `Resume - ${safeName}.${ext}`, content }
    }

    // Rate limit: 3 applications per 5 minutes per IP. Tighter than contact
    // because this form is much longer and nobody legitimately submits it
    // multiple times in quick succession.
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
      return fail("Server configuration error", 500)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // The table has no columns for the newer questions, so they are kept as
    // labeled lines in `notes`. The statement of interest is stored in `skills`.
    // The résumé file itself is not stored; it travels as an email attachment.
    const noteLines = [
      `Opportunity type: ${roleType}`,
      otherRoles ? `Other roles considered: ${otherRoles}` : "",
      credit     ? `Academic credit: ${credit}`            : "",
      resume     ? `Résumé: attached to the notification email (${resume.filename})` : "",
      notes      ? `Additional notes:\n${notes}`           : "",
    ].filter(Boolean).join("\n")

    const { error: dbError } = await supabase
      .from("volunteer_applications")
      .insert([{
        name,
        email,
        phone:              phone || null,
        roles:              [roleTitle],
        skills:             statement || null,
        education:          education || null,
        days,
        times,
        background_check:   screening || null,
        emergency_name:     null,
        emergency_phone:    null,
        emergency_relation: null,
        notes:              noteLines,
        status:             "pending"
      }])

    if (dbError) {
      console.error("Supabase insert error:", JSON.stringify(dbError))
      return fail("Failed to save application. Please try again.", 500)
    }

    const statementAndNotes = [
      statement ? `Statement of interest:\n${statement}` : "",
      notes ? `Additional notes:\n${notes}` : "",
    ].filter(Boolean).join("\n\n")

    const emailed = await notifyInfo({
      subject: `New application: ${name} — ${roleTitle}`,
      intro:   `A new application or expression of interest was submitted.`,
      fields: [
        { label: "Opportunity", value: `${roleTitle} (${roleType})` },
        { label: "Other roles", value: otherRoles || "(none)" },
        { label: "Name",        value: name },
        { label: "Email",       value: email },
        { label: "Phone",       value: phone || "(none)" },
        { label: "Education",   value: education || "(not asked)" },
        { label: "Credit",      value: credit || "(not asked)" },
        { label: "Résumé",      value: resume ? "Attached" : "(none)" },
        { label: "Days",        value: days.join(", ") },
        { label: "Times",       value: times.join(", ") },
        { label: "Screening",   value: screening || "(not asked)" },
      ],
      body: statementAndNotes || undefined,
      attachments: resume ? [resume] : undefined,
    })
    if (resume && !emailed) {
      console.error(`Résumé for ${email} was not delivered: notification email failed`)
    }

    return NextResponse.json({ success: true, message: "Application received! We will be in touch soon." })

  } catch (err) {
    console.error("Volunteer API error:", err)
    return fail("Something went wrong. Please try again.", 500)
  }
}
