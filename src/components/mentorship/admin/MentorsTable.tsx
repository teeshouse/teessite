"use client"
import { useState } from "react"
import type { Mentor } from "@/lib/mentorship/types"

const statuses = ["pending", "approved", "active", "inactive"]

export default function MentorsTable({ mentors }: { mentors: Mentor[] }) {
  const [rows, setRows] = useState(mentors)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [msg, setMsg] = useState<Record<string, string>>({})

  async function updateStatus(id: string, status: string) {
    setBusyId(id)
    const res = await fetch("/api/mentorship/admin/mentors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setRows(rs => rs.map(r => (r.id === id ? { ...r, status: status as Mentor["status"] } : r)))
    }
    setBusyId(null)
  }

  async function activate(id: string, resend = false) {
    setBusyId(id)
    setMsg(m => ({ ...m, [id]: "" }))
    try {
      const res = await fetch("/api/mentorship/admin/mentors/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: "mentor", resend }),
      })
      const data = await res.json()
      if (res.ok) {
        setRows(rs => rs.map(r => (r.id === id ? { ...r, status: resend ? r.status : "active", auth_user_id: data.authUserId ?? r.auth_user_id } : r)))
        setMsg(m => ({
          ...m,
          [id]: data.emailSent
            ? "Invite email sent"
            : "Account is set up, but the email could not be sent. Click Resend Invite to try again.",
        }))
      } else {
        setMsg(m => ({ ...m, [id]: data.error || "Failed" }))
      }
    } catch {
      setMsg(m => ({ ...m, [id]: "Network error. Please try again." }))
    }
    setBusyId(null)
  }

  if (!rows.length) return <p className="text-gray-muted text-sm">No mentor applications yet.</p>

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="p-3 font-semibold text-green-dark">Name</th>
            <th className="p-3 font-semibold text-green-dark">Email</th>
            <th className="p-3 font-semibold text-green-dark">Status</th>
            <th className="p-3 font-semibold text-green-dark">Portal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(m => (
            <tr key={m.id} className="border-b border-gray-border last:border-0">
              <td className="p-3">{m.first_name} {m.last_name}</td>
              <td className="p-3 text-gray-muted">{m.email}</td>
              <td className="p-3">
                <select className="form-input py-1.5 text-sm" value={m.status} disabled={busyId === m.id}
                  onChange={e => updateStatus(m.id, e.target.value)}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="p-3">
                {m.auth_user_id ? (
                  <div className="flex items-center gap-3">
                    <span className="text-green-mid text-xs font-medium">Account created</span>
                    <button onClick={() => activate(m.id, true)} disabled={busyId === m.id}
                      className="btn-outline text-xs py-1.5 px-3">
                      {busyId === m.id ? "Sending..." : "Resend Invite"}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => activate(m.id)} disabled={busyId === m.id}
                    className="btn-outline text-xs py-1.5 px-3">
                    {busyId === m.id ? "Sending..." : "Send Invite"}
                  </button>
                )}
                {msg[m.id] && <p className="text-xs text-gray-muted mt-1">{msg[m.id]}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
