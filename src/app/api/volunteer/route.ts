import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, roles, skills, days, times, backgroundCheck,
            emergencyName, emergencyPhone, emergencyRelation, notes } = body

    if (!name || !email || !roles?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const availability = `Days: ${days?.join(", ")} | Times: ${times?.join(", ")}`
    const message = `Skills: ${skills}\n\nBackground check: ${backgroundCheck}\n\nEmergency: ${emergencyName} (${emergencyRelation}) ${emergencyPhone}\n\nNotes: ${notes}`

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { submitVolunteerApplication } = await import("@/lib/supabase")
      await submitVolunteerApplication({ name, email, phone, role_interest: roles, availability, message })
    }

    if (process.env.RESEND_API_KEY) {
      const { sendVolunteerNotification } = await import("@/lib/resend")
      await sendVolunteerNotification({ name, email, role_interest: roles, availability, message: notes })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Volunteer API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}