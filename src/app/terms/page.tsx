import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Terms and Conditions | Tee's House Inc.",
  description: "Terms and Conditions for use of the Tee's House Inc. website."
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-green-dark text-white py-16 px-4">
          <div className="container-max text-center">
            <h1 className="text-white text-4xl mb-3">Terms and Conditions</h1>
            <p className="text-green-light">Last updated: January 24, 2025</p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max max-w-3xl">
            <div className="prose prose-lg max-w-none text-gray-muted space-y-8">

              <p>
                Please read these Terms of Use (&ldquo;Terms&rdquo;, &ldquo;Terms of Use&rdquo;) carefully before using the{" "}
                <a href="https://www.teeshouse.org" className="text-green-mid hover:underline">https://www.teeshouse.org</a>{" "}
                website (the &ldquo;Service&rdquo;) operated by Tee&apos;s House (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;).
              </p>
              <p>
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                These Terms apply to all visitors, users and others who access or use the Service. By accessing or using
                the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you
                may not access the Service.
              </p>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Accounts</h2>
                <p>
                  When you create an account with us, you must provide us information that is accurate, complete,
                  and current at all times. Failure to do so constitutes a breach of the Terms, which may result
                  in immediate termination of your account on our Service.
                </p>
                <p className="mt-3">
                  You are responsible for safeguarding the password that you use to access the Service and for any
                  activities or actions under your password. You agree not to disclose your password to any third party.
                  You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Intellectual Property</h2>
                <p>
                  The Service and its original content, features and functionality are and will remain the exclusive
                  property of Tee&apos;s House and its licensors.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Links To Other Web Sites</h2>
                <p>
                  Our Service may contain links to third-party web sites or services that are not owned or controlled
                  by Tee&apos;s House. Tee&apos;s House has no control over, and assumes no responsibility for, the content,
                  privacy policies, or practices of any third party web sites or services.
                </p>
                <p className="mt-3">
                  We strongly advise you to read the terms and conditions and privacy policies of any third-party
                  web sites or services that you visit.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Termination</h2>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any
                  reason whatsoever, including without limitation if you breach the Terms. Upon termination, your
                  right to use the Service will immediately cease.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Disclaimer</h2>
                <p>
                  Your use of the Service is at your sole risk. The Service is provided on an &ldquo;AS IS&rdquo; and
                  &ldquo;AS AVAILABLE&rdquo; basis. The Service is provided without warranties of any kind, whether express
                  or implied, including, but not limited to, implied warranties of merchantability, fitness for a
                  particular purpose, non-infringement or course of performance.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the United States
                  without regard to its conflict of law provisions. Our failure to enforce any right or provision
                  of these Terms will not be considered a waiver of those rights.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Changes</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                  If a revision is material we will try to provide at least 30 days notice prior to any new terms
                  taking effect. By continuing to access or use our Service after those revisions become effective,
                  you agree to be bound by the revised terms.
                </p>
              </div>

              <div>
                <h2 className="text-green-dark text-2xl font-display mb-3">Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at{" "}
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
                <Link href="/privacy" className="text-green-mid hover:underline">Privacy Policy</Link>
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