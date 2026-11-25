"use client"
import { useState } from "react"
import type { MentorshipApplication } from "@/lib/mentorship/types"

const statuses = ["pending", "reviewing", "matched", "active", "completed", "declined"]

export default function ApplicationsTable({ applications }: { applications: MentorshipApplication[] }) {
  const [rows, setRows] = useState(applications)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [msg, setMsg] = useState<Record<string, string>>({})
  const [showArchived, setShowArchived] = useState(false)

  async function archive(id: string, restore: boolean) {
    const person = rows.find(r => r.id === id)
    const name = person ? `${person.first_name} ${person.last_name}` : "this intern"
    const warning = restore
      ? `Restore ${name}? They will need a new portal invite.`
      : `Archive ${name}? This ends their active pair, removes their portal access, and lets the same email apply again. You can restore them later.`
    if (!window.confirm(warning)) return
    setSavingId(id)
    setMsg(m => ({ ...m, [id]: "" }))
    try {
      const res = await fetch("/api/mentorship/admin/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "intern", id, restore }),
      })
      const data = await res.json()
      if (res.ok) {
        setRows(rs => rs.map(r => (r.id === id ? { ...r, status: restore ? "reviewing" : "archived", auth_user_id: restore ? r.auth_user_id : null } : r)))
        if (!restore && data.endedPairs) setMsg(m => ({ ...m, [id]: `Archived. ${data.endedPairs} active pair ended.` }))
      } else {
        setMsg(m => ({ ...m, [id]: data.error || "Failed" }))
      }
    } catch {
      setMsg(m => ({ ...m, [id]: "Network error. Please try again." }))
    }
    setSavingId(null)
  }

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

  async function invite(id: string, resend: boolean) {
    setSavingId(id)
    setMsg(m => ({ ...m, [id]: "" }))
    try {
      const res = await fetch("/api/mentorship/admin/mentors/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: "mentee", resend }),
      })
      const data = await res.json()
      if (res.ok) {
        setRows(rs => rs.map(r => (r.id === id ? { ...r, auth_user_id: data.authUserId ?? r.auth_user_id, status: resend ? r.status : "active" } : r)))
        setMsg(m => ({
          ...m,
          [id]: data.emailSent ? "Invite email sent" : "Account is set up, but the email could not be sent. Click Resend Invite to try again.",
        }))
      } else {
        setMsg(m => ({ ...m, [id]: data.error || "Failed" }))
      }
    } catch {
      setMsg(m => ({ ...m, [id]: "Network error. Please try again." }))
    }
    setSavingId(null)
  }

  if (!rows.length) {
    return <p className="text-gray-muted text-sm">No applications yet.</p>
  }

  const archivedCount = rows.filter(r => r.status === "archived").length
  const visible = rows.filter(r => showArchived || r.status !== "archived")

  return (
    <div className="card overflow-x-auto">
      {archivedCount > 0 && (
        <label className="flex items-center gap-2 text-xs text-gray-muted p-3 border-b border-gray-border">
          <input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} />
          Show archived ({archivedCount})
        </label>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="p-3 font-semibold text-green-dark">Name</th>
            <th className="p-3 font-semibold text-green-dark">Email</th>
            <th className="p-3 font-semibold text-green-dark">Minor?</th>
            <th className="p-3 font-semibold text-green-dark">Consent</th>
            <th className="p-3 font-semibold text-green-dark">Status</th>
            <th className="p-3 font-semibold text-green-dark">Portal</th>
            <th className="p-3 font-semibold text-green-dark">Applied</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(a => (
            <tr key={a.id} className={`border-b border-gray-border last:border-0 ${a.status === "archived" ? "opacity-60" : ""}`}>
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
                {a.status === "archived" ? (
                  <span className="text-xs text-gray-muted font-medium">archived</span>
                ) : (
                  <select className="form-input py-1.5 text-sm" value={a.status} disabled={savingId === a.id}
                    onChange={e => updateStatus(a.id, e.target.value)}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </td>
              <td className="p-3">
                {a.status === "archived" ? (
                  <button onClick={() => archive(a.id, true)} disabled={savingId === a.id}
                    className="btn-outline text-xs py-1.5 px-3">Restore</button>
                ) : a.auth_user_id ? (
                  <div className="flex items-center gap-3">
                    <span className="text-green-mid text-xs font-medium">Account created</span>
                    <button onClick={() => invite(a.id, true)} disabled={savingId === a.id}
                      className="btn-outline text-xs py-1.5 px-3">
                      {savingId === a.id ? "Sending..." : "Resend Invite"}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => invite(a.id, false)} disabled={savingId === a.id}
                    className="btn-outline text-xs py-1.5 px-3">
                    {savingId === a.id ? "Sending..." : "Send Invite"}
                  </button>
                )}
                {a.status !== "archived" && (
                  <button onClick={() => archive(a.id, false)} disabled={savingId === a.id}
                    className="block text-xs text-gray-muted hover:text-red-500 hover:underline mt-2">Archive</button>
                )}
                {msg[a.id] && <p className="text-xs text-gray-muted mt-1">{msg[a.id]}</p>}
              </td>
              <td className="p-3 text-gray-muted whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
