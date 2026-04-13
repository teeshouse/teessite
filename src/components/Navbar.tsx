import { getSiteSettings } from "@/lib/sanity.fetch"
import { resolveProgramsLabels } from "@/lib/programsPageLabels"
import { resolveAllPageLabels } from "@/lib/pageLabels"
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
  const pages    = resolveAllPageLabels(settings)

  const nav: NavItem[] = [
    { label: pages.about.navLabel,   href: "/about"    },
    { label: labels.navLabel,        href: "/community-impact" },
    { label: pages.events.navLabel,  href: "/events"   },
    { label: pages.news.navLabel,    href: "/news"     },
    { label: pages.gallery.navLabel, href: "/gallery"  },
    {
      label: "More",
      children: [
        { label: "Products & Services", href: "/services"      },
        { label: "Partners",            href: "/partners"      },
        { label: "Transparency",        href: "/transparency"  },
        { label: "Client Intake",        href: "/intake"        },
        { label: "FAQ",                 href: "/faq"           },
        { label: "Contact",             href: "/contact"       },
      ]
    },
  ]

  return <NavbarClient nav={nav} />
}
