import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"

function googleCalendarLink(args: { title: string; startISO: string; durationMins: number; details?: string }) {
  const start = new Date(args.startISO)
  const end = new Date(start.getTime() + args.durationMins * 60_000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: args.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: args.details || "",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export async function GET() {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ scheduledSessions: [] })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_scheduled_sessions")
    .select("*")
    .eq("pair_id", pair.id)
    .order("scheduled_date", { ascending: true })

  if (dbError) return NextResponse.json({ error: "Failed to load scheduled sessions" }, { status: 500 })
  return NextResponse.json({ scheduledSessions: data })
}

export async function POST(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const { scheduledDate, durationMins, format, agenda, meetLink } = await req.json()
  if (!scheduledDate) return NextResponse.json({ error: "scheduledDate is required" }, { status: 400 })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_scheduled_sessions")
    .insert([{
      pair_id: pair.id,
      scheduled_date: scheduledDate,
      duration_mins: durationMins || 60,
      format: format || null,
      agenda: agenda || null,
      meet_link: meetLink || null,
      scheduled_by: user.authUserId,
    }])
    .select("*")
    .single()

  if (dbError) return NextResponse.json({ error: "Failed to schedule session" }, { status: 500 })

  const calendarLink = googleCalendarLink({
    title: "Tee's House Mentorship Session",
    startISO: scheduledDate,
    durationMins: durationMins || 60,
    details: agenda,
  })

  return NextResponse.json({ scheduledSession: data, calendarLink })
}
