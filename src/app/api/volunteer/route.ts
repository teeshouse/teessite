import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyInfo } from "@/lib/resend"
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit"
import {
  HELP_ME_FIND_A_FIT, findFormOpportunity, opportunityBadge,
  daysOfWeek, timeSlots, bgOptions, creditOptions, educationOptions,
} from "@/lib/opportunities"

const oneLine = (v: unknown, max = 200) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : ""
const multiLine = (v: unknown, max = 5000) =>
  typeof v === "string" ? v.trim().slice(0, max) : ""
const pick = (v: unknown, allowed: string[]) =>
  Array.isArray(v) ? allowed.filter(a => v.includes(a)) : []
const oneOf = (v: unknown, allowed: string[]) =>
  typeof v === "string" && allowed.includes(v) ? v : ""

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

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
    const resumeLink  = oneLine(body.resumeLink, 500)

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Name and a valid email are required" }, { status: 400 })
    }
    if (!statement || !days.length || !times.length) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 })
    }
    if (resumeLink && !/^https?:\/\//i.test(resumeLink)) {
      return NextResponse.json({ error: "Résumé link must start with http:// or https://" }, { status: 400 })
    }

    // The role must still be open on the website; a closed role is rejected even from a stale page.
    const isFitRequest = body.opportunityId === HELP_ME_FIND_A_FIT.id
    const opportunity  = isFitRequest ? undefined : findFormOpportunity(body.opportunityId)
    if (!isFitRequest && !opportunity) {
      return NextResponse.json(
        { error: "That opportunity is no longer accepting applications. Please refresh the page and choose another." },
        { status: 400 }
      )
    }
    const roleTitle = opportunity ? opportunity.title : HELP_ME_FIND_A_FIT.title
    const roleType  = opportunity ? opportunityBadge(opportunity) : "General interest"

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
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // The table has no columns for the newer questions, so they are kept as
    // labeled lines in `notes`. The statement of interest is stored in `skills`.
    const noteLines = [
      `Opportunity type: ${roleType}`,
      otherRoles ? `Other roles considered: ${otherRoles}` : "",
      credit     ? `Academic credit: ${credit}`            : "",
      resumeLink ? `Résumé: ${resumeLink}`                 : "",
      notes      ? `Additional notes:\n${notes}`           : "",
    ].filter(Boolean).join("\n")

    const { error: dbError } = await supabase
      .from("volunteer_applications")
      .insert([{
        name,
        email,
        phone:              phone || null,
        roles:              [roleTitle],
        skills:             statement,
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
      return NextResponse.json({ error: "Failed to save application. Please try again." }, { status: 500 })
    }

    const statementAndNotes = [
      `Statement of interest:\n${statement}`,
      notes ? `Additional notes:\n${notes}` : "",
    ].filter(Boolean).join("\n\n")

    await notifyInfo({
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
        { label: "Résumé",      value: resumeLink || "(none)" },
        { label: "Days",        value: days.join(", ") },
        { label: "Times",       value: times.join(", ") },
        { label: "Screening",   value: screening || "(not asked)" },
      ],
      body: statementAndNotes,
    })

    return NextResponse.json({ success: true, message: "Application received! We will be in touch soon." })

  } catch (err) {
    console.error("Volunteer API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
