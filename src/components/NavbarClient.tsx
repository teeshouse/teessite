"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

export interface NavChild { label: string; href: string }
export interface NavItem {
  label:    string
  href?:    string
  children?: NavChild[]
}

/**
 * Pure presentational Navbar. Accepts its link structure as a prop so the
 * server-side wrapper in `Navbar.tsx` can inject Sanity-driven labels.
 */
export default function NavbarClient({ nav }: { nav: NavItem[] }) {
  const [open,     setOpen]     = useState(false)
  const [dropdown, setDropdown] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-max flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src={`${CDN}/44f842016c7584b95a281fcfdba5ec79a837304b-612x612.png`}
            alt="Tee’s House" width={72} height={72} className="rounded-full"
          />
          <span className="font-display font-bold text-green-dark text-lg leading-tight hidden sm:block">
            Tee’s House<br /><span className="text-xs font-sans font-normal text-gray-muted">Inc.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {nav.map(item =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-mid transition-colors">
                  {item.label} <ChevronDown className="w-3 h-3" />
                </button>
                {dropdown && (
                  <div className="absolute top-8 right-0 bg-white border border-gray-100 rounded-card shadow-card-hover py-2 min-w-40 z-50">
                    {item.children.map(child => (
                      <Link key={child.href} href={child.href}
                        onClick={() => setDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-green-mid hover:bg-green-light transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href!}
                className="text-sm font-medium text-gray-700 hover:text-green-mid transition-colors">
                {item.label}
              </Link>
            )
          )}
          <Link href="/volunteer" className="btn-outline text-sm py-2">Volunteer</Link>
          <Link href="/intake"    className="btn-outline text-sm py-2">Client Intake</Link>
          <Link href="/donate"    className="btn-amber text-sm py-2">Donate</Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-green-dark" aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {nav.map(item =>
            item.children ? (
              <div key={item.label}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 pt-3 pb-1">{item.label}</p>
                {item.children.map(child => (
                  <Link key={child.href} href={child.href}
                    onClick={() => setOpen(false)}
                    className="block px-2 py-2 text-sm text-gray-700 hover:text-green-mid transition-colors">
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href!}
                onClick={() => setOpen(false)}
                className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-green-mid transition-colors">
                {item.label}
              </Link>
            )
          )}
          <div className="flex flex-col gap-2 pt-3">
            <Link href="/volunteer" onClick={() => setOpen(false)} className="btn-outline text-sm text-center">Volunteer</Link>
            <Link href="/intake"    onClick={() => setOpen(false)} className="btn-outline text-sm text-center">Client Intake</Link>
            <Link href="/donate"    onClick={() => setOpen(false)} className="btn-amber text-sm text-center">Donate</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
