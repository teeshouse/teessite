import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"
import { sendUserEmail } from "@/lib/resend"
import { broadcastMessage } from "@/lib/mentorship/email-templates"

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { audience, subject, message } = await req.json()
  if (!audience || !subject || !message) {
    return NextResponse.json({ error: "audience, subject, and message are required" }, { status: 400 })
  }
  if (!["mentors", "mentees", "both"].includes(audience)) {
    return NextResponse.json({ error: "Invalid audience" }, { status: 400 })
  }

  const recipients: string[] = []

  if (audience === "mentors" || audience === "both") {
    const { data } = await supabaseAdmin.from("mentors").select("email").eq("status", "active")
    recipients.push(...(data || []).map(m => m.email))
  }
  if (audience === "mentees" || audience === "both") {
    const { data } = await supabaseAdmin.from("mentorship_applications").select("email").in("status", ["matched", "active"])
    recipients.push(...(data || []).map(a => a.email))
  }

  const bodyHtml = message.split("\n").map((line: string) => `<p style="margin:0 0 12px;">${line}</p>`).join("")
  const content = broadcastMessage({ heading: subject, bodyHtml, bodyText: message })

  // Sequential sends with no artificial delay — fine for a nonprofit cohort
  // (dozens, not thousands, of recipients). Revisit with Resend's batch API
  // if recipient counts grow significantly.
  let sent = 0
  for (const to of recipients) {
    const ok = await sendUserEmail({ to, ...content })
    if (ok) sent++
  }

  return NextResponse.json({ success: true, sent, total: recipients.length })
}
