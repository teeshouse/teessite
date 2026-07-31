"use client"
import { useState } from "react"
import type { MentorshipSession } from "@/lib/mentorship/types"

export default function SessionsPanel({ sessions }: { sessions: MentorshipSession[] }) {
  const [rows, setRows] = useState(sessions)
  const [form, setForm] = useState({ sessionDate: "", durationMins: 30, format: "In person", summary: "" })
  const [saving, setSaving] = useState(false)

  async function logSession() {
    if (!form.sessionDate) return
    setSaving(true)
    const res = await fetch("/api/mentorship/portal/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { session } = await res.json()
      setRows(r => [session, ...r])
      setForm({ sessionDate: "", durationMins: 30, format: "In person", summary: "" })
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-green-dark text-sm font-semibold mb-4">Log a Session</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="form-input" type="date" value={form.sessionDate}
            onChange={e => setForm(f => ({ ...f, sessionDate: e.target.value }))} />
          <input className="form-input" type="number" placeholder="Minutes" value={form.durationMins}
            onChange={e => setForm(f => ({ ...f, durationMins: Number(e.target.value) }))} />
          <select className="form-input" value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
            <option>In person</option>
            <option>Video call</option>
            <option>Phone call</option>
          </select>
        </div>
        <textarea className="form-input mt-3 min-h-[80px]" placeholder="What did you work on?"
          value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
        <button onClick={logSession} disabled={saving || !form.sessionDate} className="btn-amber mt-3 py-2 text-sm">
          {saving ? "Saving..." : "Log Session"}
        </button>
      </div>

      <div className="space-y-3">
        {rows.map(s => (
          <div key={s.id} className="card p-4">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-green-dark text-sm">{new Date(s.session_date).toLocaleDateString()}</span>
              <span className="text-xs text-gray-muted">{s.format} · {s.duration_mins} min</span>
            </div>
            {s.summary && <p className="text-sm text-gray-body mt-2">{s.summary}</p>}
          </div>
        ))}
        {!rows.length && <p className="text-gray-muted text-sm">No sessions logged yet.</p>}
      </div>
    </div>
  )
}
