import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react"

const footerLinks = [
  { label: "About Us",     href: "/about" },
  { label: "Our Programs", href: "/programs" },
  { label: "Giving Back",  href: "/donate" },
  { label: "Volunteer",    href: "/volunteer" },
  { label: "News",         href: "/news" },
  { label: "Contact",      href: "/contact" }
]

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white mt-auto">
      <div className="container-max px-4 md:px-8 pt-12 pb-6">

        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">

          {/* Brand â€” full width on mobile, centered */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="https://cdn.sanity.io/images/zbeb0ctt/production/44f842016c7584b95a281fcfdba5ec79a837304b-612x612.png"
                alt="Tee's House"
                width={48}
                height={48}
                className="rounded-md"
              />
              <span className="font-display font-bold text-xl">Tee&apos;s House Inc.</span>
            </div>
            <p className="text-green-light text-sm leading-relaxed max-w-xs">
              Empowering minds, nourishing bodies, and building futures in Northwest Florida.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-mid hover:bg-amber transition-colors"
                aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-mid hover:bg-amber transition-colors"
                aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links â€” 2-column grid on mobile */}
          <div className="text-center md:text-left">
            <h3 className="font-display font-semibold text-amber mb-4 text-base">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-green-light text-sm hover:text-amber transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact â€” centered on mobile */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-display font-semibold text-amber mb-4 text-base">Contact Us</h3>
            <ul className="space-y-3 w-full">
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-green-light">
                <MapPin className="w-4 h-4 text-amber shrink-0" />
                <span>Pensacola, Florida</span>
              </li>
              <li>
                <a href="tel:8502911888"
                  className="flex items-center justify-center md:justify-start gap-2 text-sm text-green-light hover:text-amber transition-colors">
                  <Phone className="w-4 h-4 text-amber shrink-0" />
                  <span>850.291.1888</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@teeshouse.org"
                  className="flex items-center justify-center md:justify-start gap-2 text-sm text-green-light hover:text-amber transition-colors">
                  <Mail className="w-4 h-4 text-amber shrink-0" />
                  <span>info@teeshouse.org</span>
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <Link href="/donate" className="btn-amber text-sm px-5 py-2">
                Donate Now
              </Link>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-green-mid mt-10 pt-6">
          <div className="flex flex-col items-center gap-3 text-xs text-green-light text-center">
            <p>Tee&apos;s House Inc. is a registered 501(c)(3) nonprofit. Donations are tax-deductible to the extent permitted by law.</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <span>&copy; 2025 Tee&apos;s House Inc. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-amber transition-colors">Privacy Policy</Link>
              <Link href="/terms"   className="hover:text-amber transition-colors">Terms</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}