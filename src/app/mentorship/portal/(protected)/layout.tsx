import { redirect } from "next/navigation"
import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import PortalNav from "@/components/mentorship/PortalNav"

// Route group (protected) — mirrors the admin area's structure so
// /mentorship/portal/login and /set-password stay outside this guard.
export default async function PortalProtectedLayout({ children }: { children: React.ReactNode }) {
  const { error } = await requirePortalUser()
  if (error) redirect("/mentorship/portal/login")

  return (
    <div className="min-h-screen bg-green-light">
      <PortalNav />
      <div className="container-max py-8">{children}</div>
    </div>
  )
}
