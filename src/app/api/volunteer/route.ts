import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, roles, skills, days, times,
            backgroundCheck, emergencyName, emergencyPhone,
            emergencyRelation, notes } = body

    if (!name || !email || !phone || !roles?.length) {
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
      .from("volunteer_applications")
      .insert({
        name, email, phone,
        roles, skills, days, times,
        background_check:   backgroundCheck,
        emergency_name:     emergencyName,
        emergency_phone:    emergencyPhone,
        emergency_relation: emergencyRelation,
        notes
      })

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
      // Confirmation to applicant
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Thank you for volunteering with Tee's House!",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <div style="background:#2D5016;padding:24px 32px;border-radius:8px 8px 0 0;">
              <h1 style="color:#fff;margin:0;font-size:22px;">Thank You, ${name}!</h1>
            </div>
            <div style="background:#EAF2E3;padding:32px;">
              <p style="font-size:16px;line-height:1.6;">
                We have received your volunteer interest form and are excited to have you join the Tee's House family.
                A member of our team will be in touch soon to match you with the right opportunity.
              </p>
              <p style="font-size:15px;line-height:1.6;"><strong>Roles you expressed interest in:</strong><br/>
                ${roles.join(", ")}
              </p>
              <p style="font-size:15px;line-height:1.6;"><strong>Available days:</strong> ${days.join(", ")}<br/>
                <strong>Preferred times:</strong> ${times.join(", ")}
              </p>
              <p style="font-size:14px;color:#555;margin-top:24px;">
                Questions? Email us at
                <a href="mailto:info@teeshouse.org" style="color:#2D5016;">info@teeshouse.org</a>
                or call <a href="tel:8502911888" style="color:#2D5016;">850.291.1888</a>.
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
        subject: `New Volunteer Application â€” ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <div style="background:#2D5016;padding:20px 32px;border-radius:8px 8px 0 0;">
              <h2 style="color:#fff;margin:0;">New Volunteer Application</h2>
            </div>
            <div style="padding:24px 32px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:8px 0;color:#555;width:160px;">Name</td><td><strong>${name}</strong></td></tr>
                <tr><td style="padding:8px 0;color:#555;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#555;">Phone</td><td><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="padding:8px 0;color:#555;">Roles</td><td>${roles.join(", ")}</td></tr>
                <tr><td style="padding:8px 0;color:#555;">Available Days</td><td>${days.join(", ")}</td></tr>
                <tr><td style="padding:8px 0;color:#555;">Times</td><td>${times.join(", ")}</td></tr>
                <tr><td style="padding:8px 0;color:#555;">Background Check</td><td>${backgroundCheck}</td></tr>
                <tr><td style="padding:8px 0;color:#555;">Skills</td><td>${skills}</td></tr>
                <tr><td style="padding:8px 0;color:#555;vertical-align:top;">Emergency Contact</td>
                  <td>${emergencyName} &bull; ${emergencyPhone} &bull; ${emergencyRelation}</td></tr>
                <tr><td style="padding:8px 0;color:#555;vertical-align:top;">Notes</td><td>${notes}</td></tr>
              </table>
              <p style="margin-top:20px;font-size:13px;color:#777;">
                View all applications in your
                <a href="https://supabase.com" style="color:#2D5016;">Supabase dashboard</a>.
              </p>
            </div>
          </div>
        `
      })
    ])

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("Volunteer API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}