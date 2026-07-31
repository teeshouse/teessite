import AdminLoginForm from "@/components/mentorship/AdminLoginForm"

export const metadata = { title: "Admin Login | Tee's House Mentorship" }

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-green-light flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-amber font-semibold text-sm uppercase tracking-widest">Mentorship Program</span>
          <h1 className="text-green-dark mt-2 text-2xl">Admin Sign In</h1>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  )
}
