import { NextRequest, NextResponse } from "next/server"
import { submitVolunteerApplication } from "@/lib/supabase"
import { sendVolunteerNotification } from "@/lib/resend"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, roles, skills, days, times, backgroundCheck,
            emergencyName, emergencyPhone, emergencyRelation, notes } = body

    if (!name || !email || !roles?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await submitVolunteerApplication({
      name, email, phone,
      role_interest: roles,
      availability: `Days: ${days?.join(", ")} | Times: ${times?.join(", ")}`,
      message: `Skills: ${skills}\n\nBackground check: ${backgroundCheck}\n\nEmergency: ${emergencyName} (${emergencyRelation}) ${emergencyPhone}\n\nNotes: ${notes}`
    })

    await sendVolunteerNotification({
      name, email,
      role_interest: roles,
      availability: `Days: ${days?.join(", ")} | Times: ${times?.join(", ")}`,
      message: notes
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Volunteer API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}