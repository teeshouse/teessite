import { Resend } from "resend"
const resend = new Resend(process.env.RESEND_API_KEY)
const TO   = process.env.NOTIFICATION_EMAIL || "info@teeshouse.org"
const FROM = "Tees House Website <noreply@teeshouse.org>"

export async function sendVolunteerNotification(data: {
  name: string; email: string; role_interest: string[]
  availability: string; message?: string
}) {
  await resend.emails.send({
    from: FROM, to: TO,
    subject: `New Volunteer Application - ${data.name}`,
    html: `<h2>New Volunteer Application</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Roles:</strong> ${data.role_interest.join(", ")}</p>
      <p><strong>Availability:</strong> ${data.availability}</p>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}`
  })
}
export async function sendContactNotification(data: {
  name: string; email: string; subject?: string; message: string
}) {
  await resend.emails.send({
    from: FROM, to: TO,
    subject: `New Contact Message - ${data.subject || "General Inquiry"}`,
    html: `<h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject || "-"}</p>
      <p><strong>Message:</strong> ${data.message}</p>`
  })
}