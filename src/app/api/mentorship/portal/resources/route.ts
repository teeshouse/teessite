import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"

export async function GET() {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ resources: [] })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_resources")
    .select("*")
    .eq("pair_id", pair.id)
    .order("created_at", { ascending: false })

  if (dbError) return NextResponse.json({ error: "Failed to load resources" }, { status: 500 })
  return NextResponse.json({ resources: data })
}

export async function POST(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const { title, url, description, category } = await req.json()
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_resources")
    .insert([{ pair_id: pair.id, title, url: url || null, description: description || null, category: category || "General", added_by: user.authUserId }])
    .select("*")
    .single()

  if (dbError) return NextResponse.json({ error: "Failed to add resource" }, { status: 500 })
  return NextResponse.json({ resource: data })
}

export async function DELETE(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  const { error: dbError } = await supabaseAdmin.from("mentorship_resources").delete().eq("id", id).eq("pair_id", pair.id)
  if (dbError) return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 })
  return NextResponse.json({ success: true })
}
