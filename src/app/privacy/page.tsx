import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Tee's House Inc.",
  description: "Privacy Policy for Tee's House Inc. â€” how we collect, use, and protect your personal information."
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-green-dark text-white py-16 px-4">
          <div className="container-max text-center">
            <h1 className="text-white text-4xl mb-3">Privacy Policy</h1>
            <p className="text-green-light">Last updated: January 24, 2025</p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl">
            <div className="prose prose-lg max-w-none text-gray-muted space-y-8">

              <p>
                Tee&apos;s House (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;) operates the Tee&apos;s House website (the &ldquo;Service&rdquo;).
                This page informs you of our policies regarding the collection, use and disclosure of Personal Information
                when you use our Service. We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Information Collection And Use</h2>
                <p>
                  While using our Service, we may ask you to provide us with certain personally identifiable information
                  that can be used to contact or identify you. Personally identifiable information (&ldquo;Personal Information&rdquo;)
                  may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Telephone number</li>
                  <li>Address</li>
                </ul>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Log Data</h2>
                <p>
                  We collect information that your browser sends whenever you visit our Service (&ldquo;Log Data&rdquo;).
                  This Log Data may include information such as your computer&apos;s Internet Protocol (&ldquo;IP&rdquo;) address,
                  browser type, browser version, the pages of our Service that you visit, the time and date of your visit,
                  the time spent on those pages and other statistics.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Cookies</h2>
                <p>
                  Cookies are files with a small amount of data, which may include an anonymous unique identifier.
                  Cookies are sent to your browser from a web site and stored on your computer&apos;s hard drive.
                  We use &ldquo;cookies&rdquo; to collect information. You can instruct your browser to refuse all cookies
                  or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be
                  able to use some portions of our Service.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Service Providers</h2>
                <p>
                  We may employ third party companies and individuals to facilitate our Service, to provide the Service
                  on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
                  These third parties have access to your Personal Information only to perform these tasks on our behalf
                  and are obligated not to disclose or use it for any other purpose.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Security</h2>
                <p>
                  The security of your Personal Information is important to us, but remember that no method of
                  transmission over the Internet, or method of electronic storage is 100% secure. While we strive
                  to use commercially acceptable means to protect your Personal Information, we cannot guarantee
                  its absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Links To Other Sites</h2>
                <p>
                  Our Service may contain links to other sites that are not operated by us. If you click on a
                  third party link, you will be directed to that third party&apos;s site. We strongly advise you to
                  review the Privacy Policy of every site you visit. We have no control over, and assume no
                  responsibility for the content, privacy policies or practices of any third party sites or services.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Children&apos;s Privacy</h2>
                <p>
                  Our Service does not address anyone under the age of 18 (&ldquo;Children&rdquo;). We do not knowingly
                  collect personally identifiable information from children under 18. If you are a parent or guardian
                  and you are aware that your child has provided us with Personal Information, please contact us.
                  If we discover that a child under 18 has provided us with Personal Information, we will delete
                  such information from our servers immediately.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Compliance With Laws</h2>
                <p>
                  We will disclose your Personal Information where required to do so by law or subpoena.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Changes To This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by
                  posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
                  periodically for any changes. Changes to this Privacy Policy are effective when they are
                  posted on this page.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:info@teeshouse.org" className="text-green-mid hover:underline">
                    info@teeshouse.org
                  </a>{" "}
                  or call{" "}
                  <a href="tel:8502911888" className="text-green-mid hover:underline">
                    850.291.1888
                  </a>.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-border flex gap-6 text-sm">
                <Link href="/terms"   className="text-green-mid hover:underline">Terms and Conditions</Link>
                <Link href="/contact" className="text-green-mid hover:underline">Contact Us</Link>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}