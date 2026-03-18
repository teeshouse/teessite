import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getFaqs } from "@/lib/sanity.fetch"
import { ArrowRight } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "FAQ | Tees House Inc.",
  description: "Frequently asked questions about Tees House Inc. programs, volunteering, and donations."
}

const CATEGORIES = ["general", "programs", "volunteer", "donation"]
const CATEGORY_LABELS: Record<string, string> = {
  general:   "General Questions",
  programs:  "Our Programs",
  volunteer: "Volunteering",
  donation:  "Donations and Giving"
}

export default async function FaqPage() {
  const faqs = await getFaqs()

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Got Questions?</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Frequently Asked Questions</h1>
          </div>
        </section>

        <section className="section-padding bg-green-light">
          <div className="container-max max-w-3xl">
            {faqs.length === 0 ? (
              <div className="card p-12 text-center">
                <h2 className="text-green-dark mb-3">FAQs Coming Soon</h2>
                <p className="text-gray-muted mb-6">Have a question? Reach out directly.</p>
                <Link href="/contact" className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
              </div>
            ) : (
              CATEGORIES.map(cat => {
                const catFaqs = faqs.filter((f: any) => f.category === cat)
                if (catFaqs.length === 0) return null
                return (
                  <div key={cat} className="mb-12">
                    <h2 className="text-green-dark text-2xl mb-6">{CATEGORY_LABELS[cat]}</h2>
                    <div className="space-y-4">
                      {catFaqs.map((faq: any) => (
                        <details key={faq._id} className="card p-6 group">
                          <summary className="flex items-center justify-between cursor-pointer list-none">
                            <h3 className="text-green-dark text-lg pr-4">{faq.question}</h3>
                            <span className="text-amber shrink-0 text-2xl font-light group-open:rotate-45 transition-transform duration-200">+</span>
                          </summary>
                          <div className="mt-4 text-gray-muted leading-relaxed">
                            {faq.answer?.map((block: any, i: number) => (
                              <p key={i} className="mb-2">{block.children?.map((c: any) => c.text).join("")}</p>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
            <div className="card p-8 text-center mt-8">
              <h3 className="text-green-dark mb-2">Still have questions?</h3>
              <p className="text-gray-muted mb-4">We would love to hear from you.</p>
              <Link href="/contact" className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}