import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/mentorship/auth-guard"
import AdminNav from "@/components/mentorship/AdminNav"

// Route group (protected) — URL stays /mentorship/admin/*, but this layout
// (and its requireAdmin() check) does NOT wrap /mentorship/admin/login,
// which lives as a sibling outside this group. Without that separation,
// visiting the login page would itself redirect to the login page.
export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const { error } = await requireAdmin()
  if (error) redirect("/mentorship/admin/login")

  return (
    <div className="min-h-screen bg-green-light">
      <AdminNav />
      <div className="container-max py-8">{children}</div>
    </div>
  )
}
