import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_cohorts")
    .select("*")
    .order("year", { ascending: false })

  if (dbError) return NextResponse.json({ error: "Failed to load cohorts" }, { status: 500 })
  return NextResponse.json({ cohorts: data })
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { name, season, year, startDate, endDate, maxPairs, description } = await req.json()
  if (!name || !year) {
    return NextResponse.json({ error: "name and year are required" }, { status: 400 })
  }

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_cohorts")
    .insert([{
      name, season: season || null, year,
      start_date: startDate || null, end_date: endDate || null,
      max_pairs: maxPairs || 20, description: description || null,
      created_by: user.id,
    }])
    .select("*")
    .single()

  if (dbError) {
    console.error("Cohort create error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to create cohort" }, { status: 500 })
  }
  return NextResponse.json({ cohort: data })
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { id, status } = await req.json()
  if (!id || !status) return NextResponse.json({ error: "id and status are required" }, { status: 400 })

  const { error: dbError } = await supabaseAdmin
    .from("mentorship_cohorts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (dbError) return NextResponse.json({ error: "Failed to update cohort" }, { status: 500 })
  return NextResponse.json({ success: true })
}
