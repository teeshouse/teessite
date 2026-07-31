import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"
import { sendUserEmail } from "@/lib/resend"
import { certificateReady } from "@/lib/mentorship/email-templates"
import { generateCertificateToken } from "@/lib/mentorship/certificate-sign"

const SITE_URL = process.env.SITE_URL || "https://teeshouse.org"

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { pairId, action } = await req.json()
  if (!pairId) return NextResponse.json({ error: "pairId is required" }, { status: 400 })

  if (action === "regenerate") {
    const token = generateCertificateToken()
    const { error: dbError } = await supabaseAdmin
      .from("mentorship_pairs")
      .update({ certificate_token: token, updated_at: new Date().toISOString() })
      .eq("id", pairId)
    if (dbError) return NextResponse.json({ error: "Failed to regenerate token" }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  const { data: pair, error: fetchError } = await supabaseAdmin
    .from("mentorship_pairs")
    .select(`id, mentee:mentorship_applications(id, first_name, email, is_minor, parent_email)`)
    .eq("id", pairId)
    .maybeSingle()

  if (fetchError || !pair) {
    return NextResponse.json({ error: "Pair not found" }, { status: 404 })
  }

  const token = generateCertificateToken()
  const { error: dbError } = await supabaseAdmin
    .from("mentorship_pairs")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
      certificate_token: token,
      certificate_issued_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", pairId)

  if (dbError) {
    console.error("Certificate issue error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to issue certificate" }, { status: 500 })
  }

  const mentee = Array.isArray(pair.mentee) ? pair.mentee[0] : pair.mentee
  const certificateUrl = `${SITE_URL}/mentorship/certificate/${token}`

  if (mentee) {
    const content = certificateReady({ recipientName: mentee.first_name, certificateUrl })
    await sendUserEmail({ to: mentee.email, ...content })
    if (mentee.is_minor && mentee.parent_email) {
      await sendUserEmail({ to: mentee.parent_email, ...content })
    }
  }

  return NextResponse.json({ success: true, certificateUrl })
}
