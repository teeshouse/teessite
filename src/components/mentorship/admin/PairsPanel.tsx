"use client"
import { useState } from "react"

interface PairRow {
  id: string
  status: string
  flagged: boolean
  certificate_token: string | null
  mentor: { id: string; first_name: string; last_name: string } | null
  mentee: { id: string; first_name: string; last_name: string; is_minor: boolean } | null
}

interface SimpleMentor { id: string; first_name: string; last_name: string }
interface SimpleMentee { id: string; first_name: string; last_name: string; is_minor: boolean; parent_consent: boolean }
interface SimpleCohort { id: string; name: string }

export default function PairsPanel({
  pairs, mentors, mentees, cohorts,
}: {
  pairs: PairRow[]; mentors: SimpleMentor[]; mentees: SimpleMentee[]; cohorts: SimpleCohort[]
}) {
  const [rows, setRows] = useState(pairs)
  const [mentorId, setMentorId] = useState("")
  const [menteeId, setMenteeId] = useState("")
  const [cohortId, setCohortId] = useState("")
  const [creating, setCreating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function createPair() {
    if (!mentorId || !menteeId) return
    setCreating(true)
    setErrorMsg("")
    const res = await fetch("/api/mentorship/admin/pairs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId, menteeId, cohortId: cohortId || null }),
    })
    const data = await res.json()
    if (res.ok) {
      window.location.reload()
    } else {
      setErrorMsg(data.error || "Failed to create pair")
    }
    setCreating(false)
  }

  async function issueCertificate(pairId: string) {
    const res = await fetch("/api/mentorship/admin/certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairId }),
    })
    if (res.ok) {
      setRows(rs => rs.map(p => (p.id === pairId ? { ...p, status: "completed" } : p)))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-green-dark text-sm font-semibold mb-4">Create Pair</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="form-input" value={mentorId} onChange={e => setMentorId(e.target.value)}>
            <option value="">Select mentor</option>
            {mentors.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
          </select>
          <select className="form-input" value={menteeId} onChange={e => setMenteeId(e.target.value)}>
            <option value="">Select mentee</option>
            {mentees.map(m => (
              <option key={m.id} value={m.id}>
                {m.first_name} {m.last_name}{m.is_minor ? (m.parent_consent ? " (minor, consented)" : " (minor, NO CONSENT)") : ""}
              </option>
            ))}
          </select>
          <select className="form-input" value={cohortId} onChange={e => setCohortId(e.target.value)}>
            <option value="">No cohort</option>
            {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
        <button onClick={createPair} disabled={creating || !mentorId || !menteeId} className="btn-amber mt-4 py-2 text-sm">
          {creating ? "Creating..." : "Create Pair"}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="p-3 font-semibold text-green-dark">Mentor</th>
              <th className="p-3 font-semibold text-green-dark">Mentee</th>
              <th className="p-3 font-semibold text-green-dark">Status</th>
              <th className="p-3 font-semibold text-green-dark">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id} className="border-b border-gray-border last:border-0">
                <td className="p-3">{p.mentor ? `${p.mentor.first_name} ${p.mentor.last_name}` : "—"}</td>
                <td className="p-3">{p.mentee ? `${p.mentee.first_name} ${p.mentee.last_name}` : "—"}</td>
                <td className="p-3">
                  {p.status}{p.flagged && <span className="ml-2 text-red-500 text-xs font-semibold">FLAGGED</span>}
                </td>
                <td className="p-3">
                  {p.certificate_token ? (
                    <span className="text-green-mid text-xs font-medium">Issued</span>
                  ) : p.status === "active" ? (
                    <button onClick={() => issueCertificate(p.id)} className="btn-outline text-xs py-1.5 px-3">
                      Issue Certificate
                    </button>
                  ) : (
                    <span className="text-gray-muted text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="text-gray-muted text-sm p-4">No pairs yet.</p>}
      </div>
    </div>
  )
}
