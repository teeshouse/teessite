import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // â”€â”€ Save to Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, subject, message })

    if (dbError) {
      console.error("Supabase insert error:", JSON.stringify(dbError))
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // â”€â”€ Send emails via Resend (optional) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(resendKey)
        const FROM   = "Tee's House <noreply@teeshouse.org>"
        const NOTIFY = "info@teeshouse.org"

        await Promise.all([
          resend.emails.send({
            from: FROM, to: email,
            subject: "We received your message â€” Tee's House",
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:#2D5016;padding:24px 32px;border-radius:8px 8px 0 0;">
                  <h1 style="color:#fff;margin:0;font-size:22px;">We Got Your Message!</h1>
                </div>
                <div style="background:#EAF2E3;padding:32px;">
                  <p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
                  <p style="font-size:15px;line-height:1.6;">
                    Thank you for reaching out. We will get back to you within 1-2 business days.
                  </p>
                  <p style="font-size:14px;color:#555;">
                    Questions? <a href="tel:8502911888" style="color:#2D5016;">850.291.1888</a>
                  </p>
                </div>
                <div style="background:#2D5016;padding:12px 32px;border-radius:0 0 8px 8px;text-align:center;">
                  <p style="color:#EAF2E3;font-size:12px;margin:0;">Tee's House Inc. &bull; Pensacola, FL</p>
                </div>
              </div>`
          }),
          resend.emails.send({
            from: FROM, to: NOTIFY,
            subject: `New Contact Message â€” ${name}`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:#2D5016;padding:20px 32px;border-radius:8px 8px 0 0;">
                  <h2 style="color:#fff;margin:0;">New Contact Message</h2>
                </div>
                <div style="padding:24px 32px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
                  <table style="width:100%;font-size:14px;border-collapse:collapse;">
                    <tr><td style="padding:8px 0;color:#555;width:100px;">Name</td><td><strong>${name}</strong></td></tr>
                    <tr><td style="padding:8px 0;color:#555;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
                    ${subject ? `<tr><td style="padding:8px 0;color:#555;">Subject</td><td>${subject}</td></tr>` : ""}
                    <tr><td style="padding:8px 0;color:#555;vertical-align:top;">Message</td>
                      <td style="white-space:pre-wrap;">${message}</td></tr>
                  </table>
                </div>
              </div>`
          })
        ])
      } catch (emailErr) {
        console.error("Resend error (non-fatal):", emailErr)
      }
    } else {
      console.log("RESEND_API_KEY not set â€” skipping email notifications")
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}