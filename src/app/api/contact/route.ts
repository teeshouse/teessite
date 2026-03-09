import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // â”€â”€ Save to Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, subject, message })

    if (dbError) {
      console.error("Supabase error:", dbError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // â”€â”€ Send emails via Resend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)
    const FROM   = "Tee's House <noreply@teeshouse.org>"
    const NOTIFY = "info@teeshouse.org"

    await Promise.all([
      // Confirmation to sender
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "We received your message â€” Tee's House",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <div style="background:#2D5016;padding:24px 32px;border-radius:8px 8px 0 0;">
              <h1 style="color:#fff;margin:0;font-size:22px;">We Got Your Message!</h1>
            </div>
            <div style="background:#EAF2E3;padding:32px;">
              <p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
              <p style="font-size:15px;line-height:1.6;">
                Thank you for reaching out to Tee's House. We have received your message and will
                get back to you as soon as possible â€” usually within 1-2 business days.
              </p>
              ${subject ? `<p style="font-size:14px;color:#555;"><strong>Subject:</strong> ${subject}</p>` : ""}
              <p style="font-size:14px;color:#555;">
                In the meantime, feel free to explore our
                <a href="https://www.teeshouse.org/programs" style="color:#2D5016;">programs</a> or
                <a href="https://www.teeshouse.org/volunteer" style="color:#2D5016;">volunteer opportunities</a>.
              </p>
              <p style="font-size:14px;color:#555;margin-top:24px;">
                Questions? Call us at
                <a href="tel:8502911888" style="color:#2D5016;">850.291.1888</a>.
              </p>
              <p style="font-size:13px;color:#777;margin-top:32px;font-style:italic;">
                Together, we can keep growing â€” one seed, one idea, one heart at a time.
              </p>
            </div>
            <div style="background:#2D5016;padding:12px 32px;border-radius:0 0 8px 8px;text-align:center;">
              <p style="color:#EAF2E3;font-size:12px;margin:0;">
                Tee's House Inc. &bull; Pensacola, FL &bull; info@teeshouse.org
              </p>
            </div>
          </div>
        `
      }),

      // Notification to staff
      resend.emails.send({
        from: FROM,
        to: NOTIFY,
        subject: `New Contact Message â€” ${name}${subject ? ": " + subject : ""}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <div style="background:#2D5016;padding:20px 32px;border-radius:8px 8px 0 0;">
              <h2 style="color:#fff;margin:0;">New Contact Message</h2>
            </div>
            <div style="padding:24px 32px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:8px 0;color:#555;width:100px;">Name</td><td><strong>${name}</strong></td></tr>
                <tr><td style="padding:8px 0;color:#555;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
                ${subject ? `<tr><td style="padding:8px 0;color:#555;">Subject</td><td>${subject}</td></tr>` : ""}
                <tr><td style="padding:8px 0;color:#555;vertical-align:top;">Message</td>
                  <td style="white-space:pre-wrap;">${message}</td></tr>
              </table>
              <p style="margin-top:20px;font-size:13px;color:#777;">
                View all submissions in your
                <a href="https://supabase.com" style="color:#2D5016;">Supabase dashboard</a>.
              </p>
            </div>
          </div>
        `
      })
    ])

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}