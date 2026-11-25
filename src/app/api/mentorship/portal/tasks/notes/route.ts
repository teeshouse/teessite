import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { checkRateLimit } from "@/lib/rateLimit"
import { cleanText } from "@/lib/mentorship/input"
import { getTaskInPair, isMissingTable } from "@/lib/mentorship/task-data"
import { TASK_FILES_BUCKET, validateTaskFile, validateTaskFileBatch } from "@/lib/mentorship/task-files"

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

/**
 * Adds a note to a task, optionally with PNG/PDF/DOCX documents. Both the
 * mentor and the intern of the pair can do this. The request is multipart:
 * a JSON `payload` ({ taskId, body }) plus zero or more `files`.
 */
export async function POST(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return fail(error.message, error.status)

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair || pair.status !== "active") return fail("No active pairing")

  const gate = checkRateLimit(`task-note:${user.authUserId}`, { limit: 20, windowMs: 10 * 60_000 })
  if (!gate.ok) return fail("You're adding notes too quickly. Please wait a moment.", 429)

  let form: FormData
  try { form = await req.formData() } catch { return fail("Invalid submission.") }

  let payload: { taskId?: unknown; body?: unknown } = {}
  try { payload = JSON.parse(String(form.get("payload") ?? "{}")) } catch { return fail("Invalid submission.") }

  const task = await getTaskInPair(pair.id, payload.taskId as string)
  if (!task) return fail("Task not found", 404)

  const text = cleanText(payload.body, 3000)
  const uploads = form.getAll("files").filter((f): f is File => typeof f !== "string" && f.size > 0)
  if (!text && uploads.length === 0) return fail("Add a note or attach a document.")

  const batchError = validateTaskFileBatch(uploads.map(f => f.size))
  if (batchError) return fail(batchError)

  const checked: { bytes: Uint8Array; ext: string; contentType: string; safeName: string }[] = []
  for (const f of uploads) {
    const bytes = new Uint8Array(await f.arrayBuffer())
    const result = validateTaskFile(f.name, bytes)
    if (!result.ok) return fail(result.error)
    checked.push({ bytes, ...result })
  }

  const { data: note, error: noteError } = await supabaseAdmin
    .from("mentorship_task_notes")
    .insert([{ task_id: task.id, author_role: user.role, author_auth_id: user.authUserId, body: text }])
    .select("id")
    .single()
  if (noteError || !note) {
    console.error("Task note error:", JSON.stringify(noteError))
    return fail(isMissingTable(noteError) ? "Tasks are not set up yet. Ask an administrator to finish the database update." : "Failed to save note", 500)
  }

  const uploadedPaths: string[] = []
  try {
    for (let i = 0; i < checked.length; i++) {
      const f = checked[i]
      const path = `${pair.id}/${task.id}/${note.id}-${i + 1}.${f.ext}`
      const { error: uploadError } = await supabaseAdmin.storage
        .from(TASK_FILES_BUCKET)
        .upload(path, f.bytes, { contentType: f.contentType, upsert: false })
      if (uploadError) throw uploadError
      uploadedPaths.push(path)

      const { error: rowError } = await supabaseAdmin.from("mentorship_task_files").insert([{
        note_id: note.id, task_id: task.id, storage_path: path,
        file_name: f.safeName, content_type: f.contentType, size_bytes: f.bytes.length,
      }])
      if (rowError) throw rowError
    }
  } catch (err) {
    console.error("Task file upload error:", err)
    if (uploadedPaths.length) await supabaseAdmin.storage.from(TASK_FILES_BUCKET).remove(uploadedPaths)
    await supabaseAdmin.from("mentorship_task_notes").delete().eq("id", note.id)
    return fail("Your document could not be uploaded. Nothing was saved. Please try again.", 500)
  }

  await supabaseAdmin.from("mentorship_tasks").update({ updated_at: new Date().toISOString() }).eq("id", task.id)
  return NextResponse.json({ success: true, noteId: note.id })
}
