import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyCheckinToken } from "@/lib/mentorship/checkin-sign"
import { notifyInfo } from "@/lib/resend"

const PAGE_STYLE = `font-family:Inter,Arial,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#2D5016;`

function htmlPage(message: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Thank you</title></head>
    <body style="background:#EAF2E3;"><div style="${PAGE_STYLE}"><h1>${message}</h1></div></body></html>`
}

/**
 * Public, no-login endpoint — the HMAC-signed token in the URL is the
 * authorization, clicked from the week-4 check-in pulse email. Records a
 * 1-5 rating, auto-flags the pair if rating <= 2, one response per
 * pair+role enforced via a pre-insert lookup.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) {
    return new NextResponse(htmlPage("Missing or invalid link."), { status: 400, headers: { "Content-Type": "text/html" } })
  }

  const verified = verifyCheckinToken(token)
  if (!verified.valid) {
    return new NextResponse(htmlPage("This link is invalid or has expired."), { status: 400, headers: { "Content-Type": "text/html" } })
  }

  const { pairId, role, rating } = verified

  const { data: existing } = await supabaseAdmin
    .from("mentorship_checkin_responses")
    .select("id")
    .eq("pair_id", pairId)
    .eq("role", role)
    .maybeSingle()

  if (existing) {
    return new NextResponse(htmlPage("You've already responded to this check-in. Thank you!"), { headers: { "Content-Type": "text/html" } })
  }

  const { error: insertError } = await supabaseAdmin
    .from("mentorship_checkin_responses")
    .insert([{ pair_id: pairId, role, rating, token, responded_at: new Date().toISOString() }])

  if (insertError) {
    console.error("Checkin respond insert error:", JSON.stringify(insertError))
    return new NextResponse(htmlPage("Something went wrong recording your response."), { status: 500, headers: { "Content-Type": "text/html" } })
  }

  if (rating <= 2) {
    await supabaseAdmin
      .from("mentorship_pairs")
      .update({ flagged: true, flag_reason: `Low check-in rating (${rating}/5) from ${role}`, updated_at: new Date().toISOString() })
      .eq("id", pairId)

    await notifyInfo({
      subject: `Low check-in rating flagged: pair ${pairId}`,
      intro: `A ${role} rated their pairing ${rating}/5 in the week-4 check-in.`,
      fields: [{ label: "Pair ID", value: pairId }, { label: "Role", value: role }, { label: "Rating", value: String(rating) }],
    })
  }

  return new NextResponse(htmlPage("Thanks for letting us know!"), { headers: { "Content-Type": "text/html" } })
}
