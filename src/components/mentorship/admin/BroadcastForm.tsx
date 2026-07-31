"use client"
import { useState } from "react"

export default function BroadcastForm() {
  const [audience, setAudience] = useState<"mentors" | "mentees" | "both">("mentors")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [result, setResult] = useState("")

  async function send() {
    if (!subject.trim() || !message.trim()) return
    setStatus("sending")
    const res = await fetch("/api/mentorship/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audience, subject, message }),
    })
    const data = await res.json()
    if (res.ok) {
      setStatus("sent")
      setResult(`Sent to ${data.sent}/${data.total} recipients.`)
      setSubject("")
      setMessage("")
    } else {
      setStatus("error")
      setResult(data.error || "Failed to send")
    }
  }

  return (
    <div className="card p-6 space-y-4 max-w-2xl">
      <div>
        <label className="form-label">Audience</label>
        <select className="form-input" value={audience} onChange={e => setAudience(e.target.value as typeof audience)}>
          <option value="mentors">Active Mentors</option>
          <option value="mentees">Matched/Active Mentees</option>
          <option value="both">Both</option>
        </select>
      </div>
      <div>
        <label className="form-label">Subject</label>
        <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} />
      </div>
      <div>
        <label className="form-label">Message</label>
        <textarea className="form-input min-h-[150px]" value={message} onChange={e => setMessage(e.target.value)} />
      </div>
      {result && <p className={`text-sm ${status === "error" ? "text-red-500" : "text-green-mid"}`}>{result}</p>}
      <button onClick={send} disabled={status === "sending"} className="btn-amber py-2 text-sm">
        {status === "sending" ? "Sending..." : "Send Broadcast"}
      </button>
    </div>
  )
}
