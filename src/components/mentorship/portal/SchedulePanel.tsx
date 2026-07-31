"use client"
import { useState } from "react"
import type { MentorshipScheduledSession } from "@/lib/mentorship/types"

export default function SchedulePanel({ scheduledSessions }: { scheduledSessions: MentorshipScheduledSession[] }) {
  const [rows, setRows] = useState(scheduledSessions)
  const [form, setForm] = useState({ scheduledDate: "", durationMins: 60, agenda: "" })
  const [saving, setSaving] = useState(false)
  const [lastCalendarLink, setLastCalendarLink] = useState<string | null>(null)

  async function schedule() {
    if (!form.scheduledDate) return
    setSaving(true)
    const res = await fetch("/api/mentorship/portal/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { scheduledSession, calendarLink } = await res.json()
      setRows(r => [...r, scheduledSession].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date)))
      setLastCalendarLink(calendarLink)
      setForm({ scheduledDate: "", durationMins: 60, agenda: "" })
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-green-dark text-sm font-semibold mb-4">Schedule a Session</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="form-input" type="datetime-local" value={form.scheduledDate}
            onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} />
          <input className="form-input" type="number" placeholder="Minutes" value={form.durationMins}
            onChange={e => setForm(f => ({ ...f, durationMins: Number(e.target.value) }))} />
          <input className="form-input" placeholder="Agenda (optional)" value={form.agenda}
            onChange={e => setForm(f => ({ ...f, agenda: e.target.value }))} />
        </div>
        <button onClick={schedule} disabled={saving || !form.scheduledDate} className="btn-amber mt-3 py-2 text-sm">
          {saving ? "Scheduling..." : "Schedule Session"}
        </button>
        {lastCalendarLink && (
          <a href={lastCalendarLink} target="_blank" rel="noopener noreferrer" className="block mt-3 text-sm text-green-mid hover:underline">
            Add to Google Calendar →
          </a>
        )}
      </div>

      <div className="space-y-2">
        {rows.map(s => (
          <div key={s.id} className="card p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-dark">{new Date(s.scheduled_date).toLocaleString()}</p>
              {s.agenda && <p className="text-xs text-gray-muted">{s.agenda}</p>}
            </div>
            <span className="text-xs text-gray-muted">{s.status}</span>
          </div>
        ))}
        {!rows.length && <p className="text-gray-muted text-sm">No sessions scheduled yet.</p>}
      </div>
    </div>
  )
}
