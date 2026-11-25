import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/mentorship/auth-guard"

/**
 * Archives (or restores) a mentor or intern.
 *
 * Archiving: ends their active pair(s), removes their portal access, and sets
 * status to "archived". An archived record no longer holds its email, so the
 * same person can apply again as a fresh record (see migration 0005).
 * If the archived person was half of a pair, the other person is freed up to
 * be paired again.
 *
 * Restoring puts a mentor back to "approved" and an intern back to "reviewing";
 * they need a new portal invite.
 */
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const { kind, id, restore } = await req.json()
  if ((kind !== "mentor" && kind !== "intern") || !id || typeof id !== "string") {
    return NextResponse.json({ error: "kind ('mentor'|'intern') and id are required" }, { status: 400 })
  }

  const table = kind === "mentor" ? "mentors" : "mentorship_applications"
  const pairColumn = kind === "mentor" ? "mentor_id" : "mentee_id"
  const { data: profile } = await supabaseAdmin.from(table).select("id, status").eq("id", id).maybeSingle()
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (restore) {
    if (profile.status !== "archived") return NextResponse.json({ error: "This record is not archived." }, { status: 400 })
    const { error: dbError } = await supabaseAdmin
      .from(table)
      .update({ status: kind === "mentor" ? "approved" : "reviewing", updated_at: new Date().toISOString() })
      .eq("id", id)
    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "Someone has since applied with this same email, so this record can't be restored. Archive that newer record first." },
          { status: 409 }
        )
      }
      console.error("Restore error:", JSON.stringify(dbError))
      return NextResponse.json({ error: "Failed to restore" }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  if (profile.status === "archived") return NextResponse.json({ error: "Already archived." }, { status: 400 })

  const now = new Date().toISOString()
  const { data: ended, error: pairError } = await supabaseAdmin
    .from("mentorship_pairs")
    .update({ status: "ended_early", ended_at: now, updated_at: now })
    .eq(pairColumn, id)
    .eq("status", "active")
    .select("mentor_id, mentee_id")
  if (pairError) {
    console.error("Archive: ending pairs failed:", JSON.stringify(pairError))
    return NextResponse.json({ error: "Could not end this person's active pair, so nothing was archived." }, { status: 500 })
  }

  // Free the other half of each ended pair.
  if (kind === "mentor" && ended?.length) {
    await supabaseAdmin
      .from("mentorship_applications")
      .update({ status: "reviewing", updated_at: now })
      .in("id", ended.map(p => p.mentee_id))
      .eq("status", "matched")
  }

  const { error: dbError } = await supabaseAdmin
    .from(table)
    .update({ status: "archived", auth_user_id: null, updated_at: now })
    .eq("id", id)
  if (dbError) {
    console.error("Archive error:", JSON.stringify(dbError))
    const needsMigration = dbError.code === "23514"
    return NextResponse.json(
      { error: needsMigration ? "Archiving isn't set up yet. Ask an administrator to finish the database update." : "Failed to archive" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, endedPairs: ended?.length ?? 0 })
}
