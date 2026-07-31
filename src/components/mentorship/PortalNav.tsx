"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const links = [
  { label: "Overview", href: "/mentorship/portal" },
  { label: "Sessions", href: "/mentorship/portal/sessions" },
  { label: "Goals", href: "/mentorship/portal/goals" },
  { label: "Resources", href: "/mentorship/portal/resources" },
  { label: "Schedule", href: "/mentorship/portal/schedule" },
]

export default function PortalNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await fetch("/api/mentorship/auth/logout", { method: "POST" })
    router.push("/mentorship/portal/login")
    router.refresh()
  }

  return (
    <nav className="bg-green-dark text-white">
      <div className="container-max flex items-center justify-between h-14">
        <div className="flex items-center gap-1 overflow-x-auto">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${pathname === l.href ? "bg-white/15 text-white" : "text-green-light hover:bg-white/10"}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <button onClick={signOut} className="text-sm text-green-light hover:text-white ml-2 shrink-0">
          Sign Out
        </button>
      </div>
    </nav>
  )
}
