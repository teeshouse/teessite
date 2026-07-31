"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle } from "lucide-react"
import { createBrowserSupabase } from "@/lib/supabase-browser"

/**
 * The Supabase browser client auto-detects the access token in the URL
 * hash on mount (detectSessionInUrl, on by default) — this component just
 * confirms a session exists, then lets the user set their password.
 */
export default function SetPasswordForm() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const supabase = createBrowserSupabase()
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session))
      setReady(true)
    })
  }, [])

  async function handleSubmit() {
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.")
      setStatus("error")
      return
    }
    if (password !== confirm) {
      setErrorMsg("Passwords don't match.")
      setStatus("error")
      return
    }
    setStatus("saving")
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setErrorMsg(error.message)
      setStatus("error")
      return
    }
    setStatus("done")
    setTimeout(() => {
      router.push("/mentorship/portal")
      router.refresh()
    }, 1500)
  }

  if (!ready) {
    return <div className="card p-8 text-center text-gray-muted text-sm">Loading...</div>
  }
  if (!hasSession) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 text-sm">
          This invite link is invalid or has expired. Please contact info@teeshouse.org for a new one.
        </p>
      </div>
    )
  }
  if (status === "done") {
    return (
      <div className="card p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-mid mx-auto mb-4" />
        <p className="text-green-dark">Password set! Redirecting to your portal...</p>
      </div>
    )
  }

  return (
    <div className="card p-8 space-y-5">
      <div>
        <label className="form-label">New Password</label>
        <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div>
        <label className="form-label">Confirm Password</label>
        <input className="form-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      </div>
      {status === "error" && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <button onClick={handleSubmit} disabled={status === "saving"}
        className="btn-amber w-full justify-center py-3 disabled:opacity-50">
        {status === "saving" ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Set Password"}
      </button>
    </div>
  )
}
