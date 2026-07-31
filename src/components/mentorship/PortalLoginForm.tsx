"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createBrowserSupabase } from "@/lib/supabase-browser"

export default function PortalLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit() {
    setStatus("loading")
    setErrorMsg("")
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
      setStatus("error")
      return
    }
    router.push("/mentorship/portal")
    router.refresh()
  }

  return (
    <div className="card p-8 space-y-5 max-w-md mx-auto">
      <div>
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="form-label">Password</label>
        <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />
      </div>
      {status === "error" && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <button onClick={handleSubmit} disabled={status === "loading" || !email || !password}
        className="btn-amber w-full justify-center py-3 disabled:opacity-50">
        {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : "Sign In"}
      </button>
    </div>
  )
}
