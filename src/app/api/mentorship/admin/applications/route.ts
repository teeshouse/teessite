import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"

// Concrete template for the admin CRUD routes — the rest (mentors, cohorts,
// pairs) follow this same guard -> parse -> query -> response shape. This
// is also the direct fix for ITGC's GET/PATCH /api/mentorship route, which
// had no auth guard at all.
export async function GET() {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_applications")
    .select("*")
    .order("created_at", { ascending: false })

  if (dbError) {
    console.error("Admin applications list error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 })
  }

  return NextResponse.json({ applications: data })
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { id, status } = await req.json()
  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 })
  }

  const validStatuses = ["pending", "reviewing", "matched", "active", "completed", "declined"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const { error: dbError } = await supabaseAdmin
    .from("mentorship_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (dbError) {
    console.error("Admin application update error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
