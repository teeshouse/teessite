import { getSiteSettings } from "@/lib/sanity.fetch"
import { resolveProgramsLabels } from "@/lib/programsPageLabels"
import NavbarClient, { type NavItem } from "./NavbarClient"

/**
 * Server wrapper around NavbarClient.
 *
 * Fetches siteSettings from Sanity so that labels like the "Community
 * Impact" nav item can be renamed from Studio without a code change.
 * The client component stays purely presentational.
 *
 * If Sanity is unreachable at render time, `getSiteSettings` returns null
 * and we fall back to the hardcoded defaults in `programsPageLabels.ts`.
 */
export default async function Navbar() {
  const settings = await getSiteSettings()
  const labels   = resolveProgramsLabels(settings)

  const nav: NavItem[] = [
    { label: "About",             href: "/about"    },
    { label: labels.navLabel,     href: "/programs" },
    { label: "Events",            href: "/events"   },
    { label: "News",              href: "/news"     },
    { label: "Gallery",           href: "/gallery"  },
    {
      label: "More",
      children: [
        { label: "Partners",     href: "/partners"     },
        { label: "Transparency", href: "/transparency" },
        { label: "FAQ",          href: "/faq"          },
        { label: "Contact",      href: "/contact"      },
      ]
    },
  ]

  return <NavbarClient nav={nav} />
}
