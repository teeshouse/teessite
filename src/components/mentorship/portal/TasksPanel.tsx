"use client"
import { useRef, useState } from "react"
import type { MentorshipTask } from "@/lib/mentorship/types"
import { formatCentralDate, formatCentralDateTime, todayCentral } from "@/lib/mentorship/central-time"
import { isOverdue, type PortalRole, type TaskStatus } from "@/lib/mentorship/task-rules"
import { TASK_FILE_ACCEPT, TASK_FILE_MAX_COUNT, TASK_FILE_MAX_TOTAL_BYTES } from "@/lib/mentorship/task-files"

const STATUS_LABEL: Record<TaskStatus, string> = { open: "To do", submitted: "Done, awaiting review", completed: "Completed" }
const STATUS_STYLE: Record<TaskStatus, string> = {
  open: "bg-amber/15 text-amber",
  submitted: "bg-green-light text-green-dark",
  completed: "bg-green-mid text-white",
}
const ALLOWED_EXT = ["png", "pdf", "docx"]

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => null)
  return typeof data?.error === "string" ? data.error : fallback
}

export default function TasksPanel({
  role, initialTasks, setupNeeded, pairActive,
}: { role: PortalRole; initialTasks: MentorshipTask[]; setupNeeded: boolean; pairActive: boolean }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" })
  const isMentor = role === "mentor"
  const today = todayCentral()

  async function refresh() {
    const res = await fetch("/api/mentorship/portal/tasks")
    if (res.ok) setTasks((await res.json()).tasks)
  }

  async function createTask() {
    if (!form.title.trim()) return
    setCreating(true); setError("")
    const res = await fetch("/api/mentorship/portal/tasks", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    })
    if (res.ok) { setForm({ title: "", description: "", dueDate: "" }); await refresh() }
    else setError(await readError(res, "Could not create the task."))
    setCreating(false)
  }

  async function patch(body: Record<string, unknown>) {
    setError("")
    const res = await fetch("/api/mentorship/portal/tasks", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    })
    if (!res.ok) { setError(await readError(res, "Could not update the task.")); return false }
    await refresh()
    return true
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this task, its notes, and any uploaded documents? This cannot be undone.")) return
    setError("")
    const res = await fetch("/api/mentorship/portal/tasks", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    })
    if (res.ok) await refresh()
    else setError(await readError(res, "Could not delete the task."))
  }

  if (setupNeeded) {
    return (
      <div className="card p-6 text-sm text-gray-muted">
        Tasks are being set up. Please check back soon, or ask an administrator to finish the database update.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!pairActive && (
        <p className="text-sm text-gray-muted card p-4">This pairing has ended, so tasks are read-only.</p>
      )}

      {isMentor && pairActive && (
        <div className="card p-6">
          <h2 className="text-green-dark text-sm font-semibold mb-4">Assign a Task to Your Intern</h2>
          <div className="space-y-3">
            <input className="form-input" placeholder="Task title" maxLength={200} value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea className="form-input min-h-[80px]" placeholder="Details (optional)" maxLength={3000} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="flex flex-wrap items-end gap-3">
              <label className="text-xs text-gray-muted">
                Due date (optional)
                <input className="form-input mt-1" type="date" value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </label>
              <button onClick={createTask} disabled={creating || !form.title.trim()} className="btn-amber py-2 text-sm">
                {creating ? "Adding..." : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-4">
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} role={role} pairActive={pairActive} today={today}
            onStatus={status => patch({ id: t.id, status })}
            onEdit={fields => patch({ id: t.id, ...fields })}
            onDelete={() => remove(t.id)}
            onNoteAdded={refresh} />
        ))}
        {!tasks.length && (
          <p className="text-gray-muted text-sm">
            {isMentor ? "No tasks yet. Assign the first one above." : "No tasks yet. Your mentor will add them here."}
          </p>
        )}
      </div>
    </div>
  )
}

function TaskCard({
  task, role, pairActive, today, onStatus, onEdit, onDelete, onNoteAdded,
}: {
  task: MentorshipTask; role: PortalRole; pairActive: boolean; today: string
  onStatus: (s: TaskStatus) => void
  onEdit: (fields: { title: string; description: string; dueDate: string }) => Promise<boolean>
  onDelete: () => void
  onNoteAdded: () => Promise<void>
}) {
  const isMentor = role === "mentor"
  const status = task.status as TaskStatus
  const overdue = isOverdue(task.due_date, status, today)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [edit, setEdit] = useState({ title: task.title, description: task.description ?? "", dueDate: task.due_date ?? "" })
  const [note, setNote] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState("")
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState("")
  const fileInput = useRef<HTMLInputElement>(null)

  function pickFiles(list: FileList | null) {
    setFileError("")
    const picked = [...(list ? Array.from(list) : [])]
    if (fileInput.current) fileInput.current.value = ""
    const next = [...files, ...picked]
    const bad = picked.find(f => !ALLOWED_EXT.includes((f.name.split(".").pop() ?? "").toLowerCase()))
    if (bad) return setFileError(`"${bad.name}" isn't allowed. Only PNG, PDF, and DOCX files can be uploaded.`)
    if (next.length > TASK_FILE_MAX_COUNT) return setFileError(`You can attach up to ${TASK_FILE_MAX_COUNT} files at a time.`)
    if (next.reduce((n, f) => n + f.size, 0) > TASK_FILE_MAX_TOTAL_BYTES) return setFileError("Files are too large. Keep them under 4 MB in total.")
    setFiles(next)
  }

  async function sendNote() {
    if (!note.trim() && files.length === 0) return
    setSending(true); setSendError("")
    const data = new FormData()
    data.append("payload", JSON.stringify({ taskId: task.id, body: note }))
    files.forEach(f => data.append("files", f))
    const res = await fetch("/api/mentorship/portal/tasks/notes", { method: "POST", body: data })
    if (res.ok) { setNote(""); setFiles([]); await onNoteAdded() }
    else setSendError(await readError(res, "Could not save your note."))
    setSending(false)
  }

  async function saveEdit() {
    if (await onEdit(edit)) setEditing(false)
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input className="form-input" value={edit.title} maxLength={200} onChange={e => setEdit(v => ({ ...v, title: e.target.value }))} />
              <textarea className="form-input min-h-[70px]" value={edit.description} maxLength={3000}
                onChange={e => setEdit(v => ({ ...v, description: e.target.value }))} />
              <input className="form-input" type="date" value={edit.dueDate} onChange={e => setEdit(v => ({ ...v, dueDate: e.target.value }))} />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="btn-amber py-1.5 px-3 text-xs">Save</button>
                <button onClick={() => setEditing(false)} className="btn-outline py-1.5 px-3 text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-green-dark font-semibold text-base">{task.title}</h3>
              {task.description && <p className="text-sm text-gray-body mt-1 whitespace-pre-wrap">{task.description}</p>}
            </>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>
          {task.due_date && (
            <span className={`text-xs ${overdue ? "text-red-500 font-semibold" : "text-gray-muted"}`}>
              {overdue ? "Overdue · " : "Due "}{formatCentralDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      {pairActive && !editing && (
        <div className="flex flex-wrap gap-2 mt-4">
          {!isMentor && status === "open" && (
            <button onClick={() => onStatus("submitted")} className="btn-amber py-1.5 px-3 text-xs">Mark as done</button>
          )}
          {!isMentor && status === "submitted" && (
            <button onClick={() => onStatus("open")} className="btn-outline py-1.5 px-3 text-xs">Undo: not done yet</button>
          )}
          {isMentor && status !== "completed" && (
            <button onClick={() => onStatus("completed")} className="btn-amber py-1.5 px-3 text-xs">Mark complete</button>
          )}
          {isMentor && status === "completed" && (
            <button onClick={() => onStatus("open")} className="btn-outline py-1.5 px-3 text-xs">Reopen</button>
          )}
          {isMentor && (
            <>
              <button onClick={() => setEditing(true)} className="btn-outline py-1.5 px-3 text-xs">Edit</button>
              <button onClick={onDelete} className="text-xs text-red-500 hover:underline px-2">Delete</button>
            </>
          )}
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} className="mt-4 text-xs font-semibold text-green-mid hover:underline">
        {open ? "Hide" : "Show"} notes and documents ({task.notes.length})
      </button>

      {open && (
        <div className="mt-3 border-t border-gray-border pt-4 space-y-4">
          {task.notes.map(n => (
            <div key={n.id} className={`rounded-lg p-3 text-sm ${n.author_role === "mentor" ? "bg-green-light" : "bg-amber/10"}`}>
              <p className="text-xs text-gray-muted mb-1">
                <span className="font-semibold text-green-dark">{n.author_role === "mentor" ? "Mentor" : "Intern"}</span>
                {" · "}{formatCentralDateTime(n.created_at)}
              </p>
              {n.body && <p className="whitespace-pre-wrap text-gray-body">{n.body}</p>}
              {n.files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {n.files.map(f => (
                    <li key={f.id}>
                      <a href={`/api/mentorship/portal/tasks/files/${f.id}`} className="text-xs text-green-mid hover:underline">
                        {f.file_name}
                      </a>
                      <span className="text-xs text-gray-muted"> ({formatSize(f.size_bytes)})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {!task.notes.length && <p className="text-xs text-gray-muted">No notes yet.</p>}

          {pairActive && (
            <div className="space-y-2">
              <textarea className="form-input min-h-[70px]" placeholder="Add a note" maxLength={3000} value={note}
                onChange={e => setNote(e.target.value)} />
              <div>
                <input ref={fileInput} type="file" multiple accept={TASK_FILE_ACCEPT} onChange={e => pickFiles(e.target.files)}
                  className="block w-full text-sm text-gray-body file:mr-4 file:rounded-lg file:border-0 file:bg-green-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-dark" />
                <p className="text-xs text-gray-muted mt-1">PNG, PDF, or DOCX. Up to {TASK_FILE_MAX_COUNT} files, 4 MB in total.</p>
              </div>
              {files.length > 0 && (
                <ul className="text-xs text-gray-body space-y-1">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`}>
                      {f.name} ({formatSize(f.size)}){" "}
                      <button onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))} className="text-amber underline ml-1">Remove</button>
                    </li>
                  ))}
                </ul>
              )}
              {fileError && <p className="text-red-500 text-xs">{fileError}</p>}
              {sendError && <p className="text-red-500 text-xs">{sendError}</p>}
              <button onClick={sendNote} disabled={sending || (!note.trim() && files.length === 0)} className="btn-amber py-2 text-sm">
                {sending ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
