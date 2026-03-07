import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "News & Updates | Tees House Inc.",
  description: "Stay up to date with the latest news, events, and stories from Tees House Inc."
}

export default function NewsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative bg-green-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Stay Informed</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">News & Updates</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Stories, announcements, and highlights from our community.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max text-center">
            <div className="max-w-md mx-auto card p-10">
              <Mail className="w-12 h-12 text-green-mid mx-auto mb-4" />
              <h2 className="text-green-dark mb-3 text-2xl">Coming Soon</h2>
              <p className="text-gray-muted leading-relaxed mb-4">
                Our news and updates section is being set up. Check back soon for stories,
                program highlights, and community announcements.
              </p>
              <p className="text-gray-muted text-sm">
                In the meantime, reach us at{" "}
                <a href="mailto:info@teeshouse.org" className="text-green-mid hover:underline">
                  info@teeshouse.org
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}