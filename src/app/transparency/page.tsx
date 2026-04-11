import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getAnnualReports } from "@/lib/sanity.fetch"
import { FileText, Download, ArrowRight, Shield } from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Transparency | Tee’s House Inc.",
  description: "Tee’s House Inc. annual reports, financial transparency, and nonprofit accountability."
}

export default async function TransparencyPage() {
  const reports = await getAnnualReports()

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Accountability</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Transparency</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              We are committed to accountability and open communication with our community and donors.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: <Shield className="w-8 h-8 text-amber" />, title: "501(c)(3) Status", desc: "Tee’s House Inc. is a registered 501(c)(3) nonprofit organization. Donations are tax-deductible." },
                { icon: <FileText className="w-8 h-8 text-amber" />, title: "Annual Reporting", desc: "We publish annual reports detailing our programs, financials, and community impact." },
                { icon: <Shield className="w-8 h-8 text-amber" />, title: "Board Governed", desc: "Our organization is governed by a volunteer board of directors committed to our mission." }
              ].map(item => (
                <div key={item.title} className="card p-6 text-center">
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <h3 className="text-green-dark text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-green-dark text-2xl mb-6">Annual Reports</h2>
            {reports.length === 0 ? (
              <div className="card p-10 text-center">
                <FileText className="w-10 h-10 text-amber mx-auto mb-3" />
                <p className="text-gray-muted">Annual reports will be posted here as they become available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report: any) => (
                  <div key={report._id} className="card p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-green-dark font-semibold">{report.year} Annual Report</h3>
                      {report.title && <p className="text-gray-muted text-sm">{report.title}</p>}
                      {report.summary && <p className="text-gray-muted text-sm mt-1">{report.summary}</p>}
                    </div>
                    {report.file?.asset?.url && (
                      <a href={report.file.asset.url} target="_blank" rel="noopener noreferrer"
                        className="btn-primary text-sm shrink-0 ml-4">
                        <Download className="w-4 h-4" /> Download PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="card p-8 mt-10 bg-amber-light text-center">
              <h3 className="text-green-dark mb-2">Questions About Our Financials?</h3>
              <p className="text-gray-muted mb-4">We welcome questions from donors and community members.</p>
              <Link href="/contact" className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}