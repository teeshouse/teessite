import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { cleanText, cleanDate } from "@/lib/mentorship/input"
import { canManageTasks, canChangeTaskStatus, type TaskStatus } from "@/lib/mentorship/task-rules"
import { loadTasksForPair, isMissingTable } from "@/lib/mentorship/task-data"
import { TASK_FILES_BUCKET } from "@/lib/mentorship/task-files"

const STATUSES: TaskStatus[] = ["open", "submitted", "completed"]
const SETUP_MESSAGE = "Tasks are not set up yet. Ask an administrator to finish the database update."

export async function GET() {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair) return NextResponse.json({ tasks: [], role: user.role })

  try {
    const { tasks, setupNeeded } = await loadTasksForPair(pair.id)
    return NextResponse.json({ tasks, role: user.role, setupNeeded })
  } catch (err) {
    console.error("Load tasks error:", err)
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 })
  }
}

/** Only the mentor can create a task, and only on an active pair. */
export async function POST(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })
  if (!canManageTasks(user.role)) return NextResponse.json({ error: "Only the mentor can create tasks." }, { status: 403 })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair || pair.status !== "active") return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const body = await req.json()
  const title = cleanText(body.title, 200)
  if (!title) return NextResponse.json({ error: "A task title is required" }, { status: 400 })
  const description = cleanText(body.description, 3000)
  const dueDate = body.dueDate ? cleanDate(body.dueDate) : null
  if (body.dueDate && !dueDate) return NextResponse.json({ error: "Please choose a valid due date" }, { status: 400 })

  const { data, error: dbError } = await supabaseAdmin
    .from("mentorship_tasks")
    .insert([{ pair_id: pair.id, title, description: description || null, due_date: dueDate, created_by: user.authUserId }])
    .select("id")
    .single()

  if (dbError) {
    console.error("Task create error:", JSON.stringify(dbError))
    return NextResponse.json({ error: isMissingTable(dbError) ? SETUP_MESSAGE : "Failed to create task" }, { status: 500 })
  }
  return NextResponse.json({ success: true, id: data.id })
}

/**
 * Status changes follow task-rules (an intern can mark work done; the mentor
 * approves or reopens). Title, description, and due date are the mentor's.
 */
export async function PATCH(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair || pair.status !== "active") return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const body = await req.json()
  if (!body.id || typeof body.id !== "string") return NextResponse.json({ error: "id is required" }, { status: 400 })

  const { data: task } = await supabaseAdmin
    .from("mentorship_tasks").select("id, status").eq("id", body.id).eq("pair_id", pair.id).maybeSingle()
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    if (!canChangeTaskStatus(user.role, task.status as TaskStatus, body.status)) {
      return NextResponse.json({ error: "You can't make that change to this task." }, { status: 403 })
    }
    updates.status = body.status
    updates.completed_at = body.status === "completed" ? new Date().toISOString() : null
  }

  const editsDetails = body.title !== undefined || body.description !== undefined || body.dueDate !== undefined
  if (editsDetails) {
    if (!canManageTasks(user.role)) return NextResponse.json({ error: "Only the mentor can edit a task." }, { status: 403 })
    if (body.title !== undefined) {
      const title = cleanText(body.title, 200)
      if (!title) return NextResponse.json({ error: "A task title is required" }, { status: 400 })
      updates.title = title
    }
    if (body.description !== undefined) updates.description = cleanText(body.description, 3000) || null
    if (body.dueDate !== undefined) {
      const dueDate = body.dueDate ? cleanDate(body.dueDate) : null
      if (body.dueDate && !dueDate) return NextResponse.json({ error: "Please choose a valid due date" }, { status: 400 })
      updates.due_date = dueDate
    }
  }

  const { error: dbError } = await supabaseAdmin.from("mentorship_tasks").update(updates).eq("id", task.id).eq("pair_id", pair.id)
  if (dbError) {
    console.error("Task update error:", JSON.stringify(dbError))
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

/** Only the mentor can delete a task; its notes and uploaded files go with it. */
export async function DELETE(req: NextRequest) {
  const { error, user } = await requirePortalUser()
  if (error) return NextResponse.json({ error: error.message }, { status: error.status })
  if (!canManageTasks(user.role)) return NextResponse.json({ error: "Only the mentor can delete tasks." }, { status: 403 })

  const pair = await getPairForPortalUser(user.role, user.profileId)
  if (!pair || pair.status !== "active") return NextResponse.json({ error: "No active pairing" }, { status: 400 })

  const { id } = await req.json()
  if (!id || typeof id !== "string") return NextResponse.json({ error: "id is required" }, { status: 400 })

  const { data: task } = await supabaseAdmin.from("mentorship_tasks").select("id").eq("id", id).eq("pair_id", pair.id).maybeSingle()
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })

  const { data: files } = await supabaseAdmin.from("mentorship_task_files").select("storage_path").eq("task_id", task.id)

  const { error: dbError } = await supabaseAdmin.from("mentorship_tasks").delete().eq("id", task.id).eq("pair_id", pair.id)
  if (dbError) return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })

  const paths = (files || []).map(f => f.storage_path)
  if (paths.length) {
    const { error: removeError } = await supabaseAdmin.storage.from(TASK_FILES_BUCKET).remove(paths)
    if (removeError) console.error("Task file cleanup error:", removeError)
  }
  return NextResponse.json({ success: true })
}
