"use client"
import { useState } from "react"
import type { MentorshipCohort } from "@/lib/mentorship/types"

export default function CohortsPanel({ cohorts }: { cohorts: MentorshipCohort[] }) {
  const [rows, setRows] = useState(cohorts)
  const [form, setForm] = useState({ name: "", season: "", year: new Date().getFullYear(), maxPairs: 20 })
  const [saving, setSaving] = useState(false)

  async function create() {
    if (!form.name.trim()) return
    setSaving(true)
    const res = await fetch("/api/mentorship/admin/cohorts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { cohort } = await res.json()
      setRows(r => [cohort, ...r])
      setForm({ name: "", season: "", year: new Date().getFullYear(), maxPairs: 20 })
    }
    setSaving(false)
  }

  async function setStatus(id: string, status: string) {
    await fetch("/api/mentorship/admin/cohorts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    setRows(r => r.map(c => (c.id === id ? { ...c, status: status as MentorshipCohort["status"] } : c)))
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-green-dark text-sm font-semibold mb-4">New Cohort</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="form-input" placeholder="Name (e.g. Fall 2026)"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="form-input" placeholder="Season" value={form.season}
            onChange={e => setForm(f => ({ ...f, season: e.target.value }))} />
          <input className="form-input" type="number" placeholder="Year" value={form.year}
            onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} />
          <input className="form-input" type="number" placeholder="Max Pairs" value={form.maxPairs}
            onChange={e => setForm(f => ({ ...f, maxPairs: Number(e.target.value) }))} />
        </div>
        <button onClick={create} disabled={saving} className="btn-amber mt-4 py-2 text-sm">
          {saving ? "Creating..." : "Create Cohort"}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="p-3 font-semibold text-green-dark">Name</th>
              <th className="p-3 font-semibold text-green-dark">Year</th>
              <th className="p-3 font-semibold text-green-dark">Max Pairs</th>
              <th className="p-3 font-semibold text-green-dark">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} className="border-b border-gray-border last:border-0">
                <td className="p-3">{c.name}</td>
                <td className="p-3 text-gray-muted">{c.year}</td>
                <td className="p-3 text-gray-muted">{c.max_pairs}</td>
                <td className="p-3">
                  <select className="form-input py-1.5 text-sm" value={c.status}
                    onChange={e => setStatus(c.id, e.target.value)}>
                    <option value="upcoming">upcoming</option>
                    <option value="active">active</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="text-gray-muted text-sm p-4">No cohorts yet.</p>}
      </div>
    </div>
  )
}
