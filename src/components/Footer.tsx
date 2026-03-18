import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Instagram, Facebook, Heart } from "lucide-react"

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white">
      <div className="container-max py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={`${CDN}/44f842016c7584b95a281fcfdba5ec79a837304b-612x612.png`}
                alt="Tees House" width={56} height={56} className="rounded-full"
              />
              <span className="font-display font-bold text-white text-lg">Tees House Inc.</span>
            </div>
            <p className="text-green-light text-sm leading-relaxed mb-4">
              Cultivating youth development through agriculture, arts, and education in Pensacola, FL.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/teeshouseinc" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Programs</h4>
            <ul className="space-y-2">
              {[
                { label: "Our Programs",  href: "/programs"      },
                { label: "Events",        href: "/events"        },
                { label: "News",          href: "/news"          },
                { label: "Gallery",       href: "/gallery"       },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-green-light text-sm hover:text-amber transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Organization</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us",      href: "/about"         },
                { label: "Partners",      href: "/partners"      },
                { label: "Transparency",  href: "/transparency"  },
                { label: "FAQ",           href: "/faq"           },
                { label: "Volunteer",     href: "/volunteer"     },
                { label: "Contact",       href: "/contact"       },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-green-light text-sm hover:text-amber transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:8502911888" className="flex items-start gap-2 text-green-light text-sm hover:text-amber transition-colors">
                  <Phone className="w-4 h-4 text-amber mt-0.5 shrink-0" />850.291.1888
                </a>
              </li>
              <li>
                <a href="mailto:info@teeshouse.org" className="flex items-start gap-2 text-green-light text-sm hover:text-amber transition-colors">
                  <Mail className="w-4 h-4 text-amber mt-0.5 shrink-0" />info@teeshouse.org
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-green-light text-sm">
                  <MapPin className="w-4 h-4 text-amber mt-0.5 shrink-0" />7823 Bay Meadows Dr<br />Pensacola, FL 32507
                </span>
              </li>
            </ul>
            <Link href="/donate" className="btn-amber text-sm mt-6 inline-flex">
              <Heart className="w-4 h-4" /> Donate Now
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-max py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-green-light">
          <p>2025 Tees House Inc. All rights reserved. 501(c)(3) Nonprofit Organization.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-amber transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}