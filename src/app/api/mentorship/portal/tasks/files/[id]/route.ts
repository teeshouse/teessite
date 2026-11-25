import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser, requireAdmin } from "@/lib/mentorship/auth-guard"
import { TASK_FILES_BUCKET } from "@/lib/mentorship/task-files"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Hands out a one-minute download link for a task document, only after
 * confirming the signed-in person is the mentor or intern of the pair that
 * owns it (or an admin). The storage bucket itself is private.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!UUID.test(params.id)) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const portal = await requirePortalUser()
  const isAdmin = portal.error ? !(await requireAdmin()).error : false
  if (portal.error && !isAdmin) return NextResponse.json({ error: portal.error.message }, { status: portal.error.status })

  const { data: file } = await supabaseAdmin
    .from("mentorship_task_files")
    .select("storage_path, file_name, task:mentorship_tasks(pair_id)")
    .eq("id", params.id)
    .maybeSingle()
  const task = Array.isArray(file?.task) ? file?.task[0] : file?.task
  if (!file || !task) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (!isAdmin && portal.user) {
    const column = portal.user.role === "mentor" ? "mentor_id" : "mentee_id"
    const { data: pair } = await supabaseAdmin
      .from("mentorship_pairs").select("id").eq("id", task.pair_id).eq(column, portal.user.profileId).maybeSingle()
    if (!pair) return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { data, error } = await supabaseAdmin.storage
    .from(TASK_FILES_BUCKET)
    .createSignedUrl(file.storage_path, 60, { download: file.file_name })
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Could not open this file" }, { status: 500 })

  return NextResponse.redirect(data.signedUrl, 302)
}
