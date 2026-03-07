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
      <div className="container-max section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="https://www.teeshouse.org/wp-content/uploads/2024/12/cropped-file.png"
                alt="Tee's House"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="font-display font-bold text-xl">Tee&apos;s House Inc.</span>
            </div>
            <p className="text-green-light text-sm leading-relaxed">
              Empowering minds, nourishing bodies, and building futures in Northwest Florida.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-mid hover:bg-amber transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-mid hover:bg-amber transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-display font-semibold text-amber mb-3 text-base">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-green-light text-sm hover:text-amber transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold text-amber mb-3 text-base">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-green-light">
                <MapPin className="w-4 h-4 mt-0.5 text-amber shrink-0" />Pensacola, Florida
              </li>
              <li>
                <a href="tel:8502911888" className="flex items-center gap-2 text-sm text-green-light hover:text-amber transition-colors">
                  <Phone className="w-4 h-4 text-amber" />850.291.1888
                </a>
              </li>
              <li>
                <a href="mailto:info@teeshouse.org" className="flex items-center gap-2 text-sm text-green-light hover:text-amber transition-colors">
                  <Mail className="w-4 h-4 text-amber" />info@teeshouse.org
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/donate" className="btn-amber text-sm px-5 py-2">Donate Now</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-green-mid mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-green-light">
          <p>2025 Tee&apos;s House Inc. All rights reserved.</p>
          <p className="text-center">Tee&apos;s House Inc. is a registered 501(c)(3) nonprofit. Donations are tax-deductible to the extent permitted by law.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-amber transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}