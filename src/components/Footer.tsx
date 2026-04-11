import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Heart } from "lucide-react"

const CDN = "https://cdn.sanity.io/images/zbeb0ctt/production"

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white">
      {/* Main footer */}
      <div className="container-max py-12">

        {/* Mobile: stacked brand + donate CTA */}
        <div className="flex flex-col items-center text-center mb-10 md:hidden">
          <Image
            src={`${CDN}/44f842016c7584b95a281fcfdba5ec79a837304b-612x612.png`}
            alt="Tee's House" width={56} height={56} className="rounded-full mb-3"
          />
          <p className="font-display font-bold text-white text-lg mb-1">Tee’s House Inc.</p>
          <p className="text-green-light text-xs mb-4 max-w-xs">
            Cultivating youth through agriculture, arts, and education in Pensacola, FL.
          </p>
          <div className="flex gap-3 mb-4">
            <a href="https://instagram.com/_teeshouse" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/teeshouseinc" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/teeshouse/" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
          <Link href="/donate" className="btn-amber text-sm w-full max-w-xs justify-center">
            <Heart className="w-4 h-4" /> Donate Now
          </Link>
        </div>

        {/* Mobile: 2-col compact links */}
        <div className="grid grid-cols-2 gap-6 mb-8 md:hidden">
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Explore</h4>
            <ul className="space-y-2">
              {[
                { label: "Programs",  href: "/programs"  },
                { label: "Events",    href: "/events"    },
                { label: "News",      href: "/news"      },
                { label: "Gallery",   href: "/gallery"   },
                { label: "About",     href: "/about"     },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-green-light text-sm hover:text-amber transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Support</h4>
            <ul className="space-y-2">
              {[
                { label: "Volunteer",     href: "/volunteer"     },
                { label: "Partners",      href: "/partners"      },
                { label: "Transparency",  href: "/transparency"  },
                { label: "FAQ",           href: "/faq"           },
                { label: "Contact",       href: "/contact"       },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-green-light text-sm hover:text-amber transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile: compact contact strip */}
        <div className="flex flex-col gap-2 mb-6 md:hidden">
          <a href="tel:8502911888" className="flex items-center gap-2 text-green-light text-sm">
            <Phone className="w-4 h-4 text-amber shrink-0" />850.291.1888
          </a>
          <a href="mailto:info@teeshousepensacola.org" className="flex items-center gap-2 text-green-light text-sm">
            <Mail className="w-4 h-4 text-amber shrink-0" />info@teeshousepensacola.org
          </a>
          <span className="flex items-center gap-2 text-green-light text-sm">
            <MapPin className="w-4 h-4 text-amber shrink-0" />7823 Bay Meadows Dr, Pensacola, FL 32507
          </span>
        </div>

        {/* Desktop: full 4-col layout */}
        <div className="hidden md:grid grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={`${CDN}/44f842016c7584b95a281fcfdba5ec79a837304b-612x612.png`}
                alt="Tee's House" width={56} height={56} className="rounded-full"
              />
              <span className="font-display font-bold text-white text-lg">Tee’s House Inc.</span>
            </div>
            <p className="text-green-light text-sm leading-relaxed mb-4">
              Cultivating youth development through agriculture, arts, and education in Pensacola, FL.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/_teeshouse" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/teeshouseinc" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/teeshouse/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Programs</h4>
            <ul className="space-y-2">
              {[
                { label: "Our Programs", href: "/programs" },
                { label: "Events",       href: "/events"   },
                { label: "News",         href: "/news"     },
                { label: "Gallery",      href: "/gallery"  },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-green-light text-sm hover:text-amber transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Organization</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us",     href: "/about"        },
                { label: "Partners",     href: "/partners"     },
                { label: "Transparency", href: "/transparency" },
                { label: "FAQ",          href: "/faq"          },
                { label: "Volunteer",    href: "/volunteer"    },
                { label: "Contact",      href: "/contact"      },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-green-light text-sm hover:text-amber transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:8502911888" className="flex items-start gap-2 text-green-light text-sm hover:text-amber transition-colors">
                  <Phone className="w-4 h-4 text-amber mt-0.5 shrink-0" />850.291.1888
                </a>
              </li>
              <li>
                <a href="mailto:info@teeshousepensacola.org" className="flex items-start gap-2 text-green-light text-sm hover:text-amber transition-colors">
                  <Mail className="w-4 h-4 text-amber mt-0.5 shrink-0" />info@teeshousepensacola.org
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
        <div className="container-max py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-green-light">
          <p className="text-center md:text-left">2025 Tee’s House Inc. All rights reserved. 501(c)(3) Nonprofit.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-amber transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}