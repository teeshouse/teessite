"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "About Us",     href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Giving Back",  href: "/donate" },
  { label: "Volunteer",    href: "/volunteer" },
  { label: "News",         href: "/news" },
  { label: "Contact",      href: "/contact" }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <nav className="bg-green-dark text-white sticky top-0 z-50 shadow-md">
      <div className="container-max flex items-center justify-between h-16 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image
            src="https://cdn.sanity.io/images/zbeb0ctt/production/44f842016c7584b95a281fcfdba5ec79a837304b-612x612.png"
            alt="Tee's House"
            width={72} height={72}
            className="rounded-md"
          />
          <span className="font-display font-bold text-xl text-white">Tee&apos;s House</span>
        </Link>
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${pathname === link.href ? "bg-green-mid text-white" : "text-green-light hover:bg-green-mid hover:text-white"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/donate" className="ml-3 btn-amber text-sm px-4 py-2">Donate</Link>
        </div>
        <button className="lg:hidden p-2 rounded-md hover:bg-green-mid transition-colors"
          onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-green-dark border-t border-green-mid px-4 pb-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`block px-3 py-3 rounded-md text-sm font-medium transition-colors
                ${pathname === link.href ? "bg-green-mid text-white" : "text-green-light hover:bg-green-mid"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/donate" onClick={() => setOpen(false)}
            className="block mt-3 btn-amber text-center text-sm">Donate Now</Link>
        </div>
      )}
    </nav>
  )
}