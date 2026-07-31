"use client"
import { useState } from "react"
import type { MentorshipResource } from "@/lib/mentorship/types"

export default function ResourcesPanel({ resources }: { resources: MentorshipResource[] }) {
  const [rows, setRows] = useState(resources)
  const [form, setForm] = useState({ title: "", url: "" })
  const [saving, setSaving] = useState(false)

  async function addResource() {
    if (!form.title.trim()) return
    setSaving(true)
    const res = await fetch("/api/mentorship/portal/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { resource } = await res.json()
      setRows(r => [resource, ...r])
      setForm({ title: "", url: "" })
    }
    setSaving(false)
  }

  async function remove(id: string) {
    const res = await fetch("/api/mentorship/portal/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setRows(r => r.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="form-input md:col-span-1" placeholder="Title" value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="form-input md:col-span-1" placeholder="Link (optional)" value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
        <button onClick={addResource} disabled={saving || !form.title.trim()} className="btn-amber py-2 text-sm">
          Add Resource
        </button>
      </div>

      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-body font-medium">{r.title}</p>
              {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-mid hover:underline">{r.url}</a>}
            </div>
            <button onClick={() => remove(r.id)} className="text-xs text-red-500 hover:underline">Remove</button>
          </div>
        ))}
        {!rows.length && <p className="text-gray-muted text-sm">No resources shared yet.</p>}
      </div>
    </div>
  )
}
