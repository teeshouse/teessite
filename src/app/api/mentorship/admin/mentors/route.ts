import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentors")
    .select("*")
    .order("created_at", { ascending: false })

  if (dbError) {
    console.error("Admin mentors list error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to load mentors" }, { status: 500 })
  }

  return NextResponse.json({ mentors: data })
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { id, status } = await req.json()
  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 })
  }

  const validStatuses = ["pending", "approved", "active", "inactive"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === "approved") updates.approved_at = new Date().toISOString()

  const { error: dbError } = await supabaseAdmin.from("mentors").update(updates).eq("id", id)

  if (dbError) {
    console.error("Admin mentor update error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to update mentor" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
