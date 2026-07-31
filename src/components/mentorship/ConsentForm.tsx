"use client"
import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

export default function ConsentForm({ token, applicantName }: { token: string; applicantName: string }) {
  const [checked, setChecked] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit() {
    if (!checked) return
    setStatus("loading")
    try {
      const res = await fetch("/api/mentorship/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.")
        setStatus("error")
        return
      }
      setStatus("success")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="card p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-mid mx-auto mb-4" />
        <h3 className="text-green-dark mb-2">Consent Confirmed</h3>
        <p className="text-gray-muted text-sm">
          Thank you for confirming consent for {applicantName}. Our team will follow up as we match
          mentors within the current cohort.
        </p>
      </div>
    )
  }

  return (
    <div className="card p-8 space-y-5">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 mt-1 accent-green-mid"
          checked={checked} onChange={e => setChecked(e.target.checked)} />
        <span className="text-sm text-gray-body">
          I am {applicantName}&rsquo;s parent or legal guardian, and I consent to their
          participation in Tee&rsquo;s House&rsquo;s mentorship program under the safeguards
          described above. I understand this consent is recorded with a timestamp and my IP
          address, and that I may withdraw it at any time by contacting info@teeshouse.org.
        </span>
      </label>
      {status === "error" && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <button onClick={handleSubmit} disabled={!checked || status === "loading"}
        className="btn-amber w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed">
        {status === "loading"
          ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
          : "Confirm Consent"}
      </button>
    </div>
  )
}
