import { supabaseAdmin } from "@/lib/supabase"
import type { MentorshipTask, TaskNote, TaskFile } from "@/lib/mentorship/types"

const STATUS_ORDER: Record<string, number> = { open: 0, submitted: 1, completed: 2 }

/** True when a database error means the tasks tables have not been created yet. */
export function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  return Boolean(error && (error.code === "PGRST205" || error.code === "42P01" || /schema cache|does not exist/i.test(error.message || "")))
}

/** Loads every task for a pair with its notes and files (never the storage path). */
export async function loadTasksForPair(pairId: string): Promise<{ tasks: MentorshipTask[]; setupNeeded: boolean }> {
  const { data: tasks, error } = await supabaseAdmin
    .from("mentorship_tasks")
    .select("id, pair_id, title, description, due_date, status, completed_at, created_at, updated_at")
    .eq("pair_id", pairId)
  if (error) {
    if (isMissingTable(error)) return { tasks: [], setupNeeded: true }
    throw new Error(`Failed to load tasks: ${error.message}`)
  }
  if (!tasks?.length) return { tasks: [], setupNeeded: false }

  const ids = tasks.map(t => t.id)
  const [{ data: notes, error: notesError }, { data: files, error: filesError }] = await Promise.all([
    supabaseAdmin.from("mentorship_task_notes").select("id, task_id, author_role, body, created_at").in("task_id", ids).order("created_at", { ascending: true }),
    supabaseAdmin.from("mentorship_task_files").select("id, note_id, task_id, file_name, content_type, size_bytes, created_at").in("task_id", ids),
  ])
  if (notesError || filesError) throw new Error("Failed to load task notes")

  const filesByNote = new Map<string, TaskFile[]>()
  for (const f of (files || []) as TaskFile[]) filesByNote.set(f.note_id, [...(filesByNote.get(f.note_id) || []), f])
  const notesByTask = new Map<string, TaskNote[]>()
  for (const n of (notes || []) as Omit<TaskNote, "files">[]) {
    notesByTask.set(n.task_id, [...(notesByTask.get(n.task_id) || []), { ...n, files: filesByNote.get(n.id) || [] }])
  }

  const result = (tasks as Omit<MentorshipTask, "notes">[])
    .map(t => ({ ...t, notes: notesByTask.get(t.id) || [] }))
    .sort((a, b) =>
      (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) ||
      ((a.due_date ?? "9999-12-31").localeCompare(b.due_date ?? "9999-12-31")) ||
      b.created_at.localeCompare(a.created_at)
    )
  return { tasks: result, setupNeeded: false }
}

/** Finds a task only if it belongs to the given pair, so one pair can never reach another's tasks. */
export async function getTaskInPair(pairId: string, taskId: string) {
  if (typeof taskId !== "string") return null
  const { data } = await supabaseAdmin
    .from("mentorship_tasks")
    .select("id, pair_id, title, status")
    .eq("id", taskId)
    .eq("pair_id", pairId)
    .maybeSingle()
  return data
}
