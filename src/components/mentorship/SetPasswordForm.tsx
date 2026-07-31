"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle } from "lucide-react"
import { createBrowserSupabase } from "@/lib/supabase-browser"

/**
 * supabase.auth.admin.generateLink() (invites, password recovery) always
 * redirects here with tokens in the URL hash fragment (#access_token=...).
 * @supabase/ssr's cookie-based browser client is built around a
 * server-exchanged-code SSR pattern, not automatic hash detection — relying
 * on detectSessionInUrl here silently found nothing even on fresh, valid
 * links. So we parse the hash ourselves and call setSession() explicitly,
 * which is deterministic regardless of flowType/storage-adapter quirks.
 */
function parseHashTokens(): { access_token: string; refresh_token: string } | null {
  const hash = typeof window !== "undefined" ? window.location.hash : ""
  if (!hash) return null
  const params = new URLSearchParams(hash.slice(1))
  const access_token = params.get("access_token")
  const refresh_token = params.get("refresh_token")
  if (!access_token || !refresh_token) return null
  return { access_token, refresh_token }
}

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
    const tokens = parseHashTokens()

    async function establishSession() {
      if (tokens) {
        const { error } = await supabase.auth.setSession(tokens)
        if (!error) {
          // Drop the tokens from the URL — no reason to leave them visible
          // in the address bar/history once the session is established.
          window.history.replaceState(null, "", window.location.pathname)
          setHasSession(true)
          setReady(true)
          return
        }
      }
      // Fallback: maybe a session already exists (e.g. page refresh after
      // the hash was already consumed and cleared above).
      const { data } = await supabase.auth.getSession()
      setHasSession(Boolean(data.session))
      setReady(true)
    }

    establishSession()
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
