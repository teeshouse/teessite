"use client"
import { useState, useEffect, useRef } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { Loader2, CheckCircle } from "lucide-react"

/**
 * supabase.auth.admin.generateLink() (invites, password recovery) always
 * redirects here with tokens in the URL hash fragment (#access_token=...).
 * Uses a plain, non-persisted supabase-js client (not @supabase/ssr) — see
 * git history on auth-guard.ts/login route for why the SSR cookie client
 * was dropped entirely. This client only needs to hold the session
 * in-memory long enough to call setSession() then updateUser().
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
  const clientRef = useRef<SupabaseClient | null>(null)
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    clientRef.current = client

    const tokens = parseHashTokens()
    if (!tokens) {
      setReady(true)
      return
    }

    client.auth.setSession(tokens).then(({ data, error }) => {
      if (!error && data.session) {
        window.history.replaceState(null, "", window.location.pathname)
        setEmail(data.session.user.email ?? null)
        setHasSession(true)
      }
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
    const client = clientRef.current
    if (!client) return

    setStatus("saving")
    const { error } = await client.auth.updateUser({ password })
    if (error) {
      setErrorMsg(error.message)
      setStatus("error")
      return
    }

    // Auto sign-in with the password they just set, so they don't have to
    // type it twice. If this fails for some reason they can still just log
    // in normally with the password they just chose.
    if (email) {
      await fetch("/api/mentorship/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
    }

    setStatus("done")
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
      <div className="card p-8 text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-green-mid mx-auto mb-1" />
        <p className="text-green-dark">Password set!</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/mentorship/portal" className="btn-primary">Go to My Portal</a>
          <a href="/mentorship/admin" className="btn-outline">Go to Admin Dashboard</a>
        </div>
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
