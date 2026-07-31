import SetPasswordForm from "@/components/mentorship/SetPasswordForm"

export const metadata = { title: "Set Your Password | Tee's House Mentorship" }

export default function SetPasswordPage() {
  return (
    <main className="min-h-screen bg-green-light flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-amber font-semibold text-sm uppercase tracking-widest">Mentorship Program</span>
          <h1 className="text-green-dark mt-2 text-2xl">Set Your Password</h1>
        </div>
        <SetPasswordForm />
      </div>
    </main>
  )
}
