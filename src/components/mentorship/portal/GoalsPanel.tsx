"use client"
import { useState } from "react"
import type { MentorshipGoal } from "@/lib/mentorship/types"

export default function GoalsPanel({ goals }: { goals: MentorshipGoal[] }) {
  const [rows, setRows] = useState(goals)
  const [title, setTitle] = useState("")
  const [saving, setSaving] = useState(false)

  async function addGoal() {
    if (!title.trim()) return
    setSaving(true)
    const res = await fetch("/api/mentorship/portal/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    if (res.ok) {
      const { goal } = await res.json()
      setRows(r => [goal, ...r])
      setTitle("")
    }
    setSaving(false)
  }

  async function toggleComplete(id: string, current: string) {
    const status = current === "completed" ? "in_progress" : "completed"
    const res = await fetch("/api/mentorship/portal/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setRows(r => r.map(g => (g.id === id ? { ...g, status: status as MentorshipGoal["status"] } : g)))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 flex gap-3">
        <input className="form-input" placeholder="New goal..." value={title}
          onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addGoal()} />
        <button onClick={addGoal} disabled={saving || !title.trim()} className="btn-amber py-2 px-4 text-sm shrink-0">
          Add
        </button>
      </div>

      <div className="space-y-2">
        {rows.map(g => (
          <label key={g.id} className="card p-4 flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-green-mid"
              checked={g.status === "completed"} onChange={() => toggleComplete(g.id, g.status)} />
            <span className={`text-sm ${g.status === "completed" ? "line-through text-gray-muted" : "text-gray-body"}`}>
              {g.title}
            </span>
          </label>
        ))}
        {!rows.length && <p className="text-gray-muted text-sm">No goals set yet.</p>}
      </div>
    </div>
  )
}
