"use client"
import { useState } from "react"
import type { MentorshipApplication } from "@/lib/mentorship/types"

const statuses = ["pending", "reviewing", "matched", "active", "completed", "declined"]

export default function ApplicationsTable({ applications }: { applications: MentorshipApplication[] }) {
  const [rows, setRows] = useState(applications)
  const [savingId, setSavingId] = useState<string | null>(null)

  async function updateStatus(id: string, status: string) {
    setSavingId(id)
    const res = await fetch("/api/mentorship/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setRows(rs => rs.map(r => (r.id === id ? { ...r, status: status as MentorshipApplication["status"] } : r)))
    }
    setSavingId(null)
  }

  if (!rows.length) {
    return <p className="text-gray-muted text-sm">No applications yet.</p>
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="p-3 font-semibold text-green-dark">Name</th>
            <th className="p-3 font-semibold text-green-dark">Email</th>
            <th className="p-3 font-semibold text-green-dark">Minor?</th>
            <th className="p-3 font-semibold text-green-dark">Consent</th>
            <th className="p-3 font-semibold text-green-dark">Status</th>
            <th className="p-3 font-semibold text-green-dark">Applied</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(a => (
            <tr key={a.id} className="border-b border-gray-border last:border-0">
              <td className="p-3">{a.first_name} {a.last_name}</td>
              <td className="p-3 text-gray-muted">{a.email}</td>
              <td className="p-3">{a.is_minor ? "Yes" : "No"}</td>
              <td className="p-3">
                {a.is_minor
                  ? a.parent_consent
                    ? <span className="text-green-mid font-medium">Confirmed</span>
                    : <span className="text-amber font-medium">Pending</span>
                  : <span className="text-gray-muted">N/A</span>}
              </td>
              <td className="p-3">
                <select className="form-input py-1.5 text-sm" value={a.status} disabled={savingId === a.id}
                  onChange={e => updateStatus(a.id, e.target.value)}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="p-3 text-gray-muted whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
