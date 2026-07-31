"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createBrowserSupabase } from "@/lib/supabase-browser"

const links = [
  { label: "Applications", href: "/mentorship/admin/applications" },
  { label: "Mentors", href: "/mentorship/admin/mentors" },
  { label: "Cohorts", href: "/mentorship/admin/cohorts" },
  { label: "Pairs", href: "/mentorship/admin/pairs" },
  { label: "Broadcast", href: "/mentorship/admin/broadcast" },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push("/mentorship/admin/login")
    router.refresh()
  }

  return (
    <nav className="bg-green-dark text-white">
      <div className="container-max flex items-center justify-between h-14">
        <div className="flex items-center gap-1 overflow-x-auto">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${pathname?.startsWith(l.href) ? "bg-white/15 text-white" : "text-green-light hover:bg-white/10"}`}>
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
