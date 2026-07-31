import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ConsentForm from "@/components/mentorship/ConsentForm"
import { supabaseAdmin } from "@/lib/supabase"
import { ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Parental Consent | Tee's House",
}
export const revalidate = 0

async function getApplication(token: string) {
  const { data } = await supabaseAdmin
    .from("mentorship_applications")
    .select("id, first_name, last_name, parent_name, parent_token_expires_at, parent_consent")
    .eq("parent_token", token)
    .maybeSingle()
  return data
}

export default async function ConsentPage({ params }: { params: { token: string } }) {
  const app = await getApplication(params.token)

  const invalid = !app
  const expired = app && app.parent_token_expires_at && new Date(app.parent_token_expires_at) < new Date()
  const alreadyConsented = app?.parent_consent

  return (
    <>
      <Navbar />
      <main>
        <section className="relative text-white py-20 px-4 overflow-hidden bg-green-dark">
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Parental Consent</span>
            <h1 className="text-white mt-3 text-3xl md:text-4xl">Mentorship Program</h1>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max max-w-2xl">
            {invalid || expired ? (
              <div className="card p-8 text-center">
                <h2 className="text-green-dark mb-3">
                  {invalid ? "Consent Link Not Found" : "Consent Link Expired"}
                </h2>
                <p className="text-gray-muted text-sm">
                  {invalid
                    ? "This link doesn't match an application on file. Please check the link or contact us at info@teeshouse.org."
                    : "This link has expired. Please contact us at info@teeshouse.org and we'll send a new one."}
                </p>
              </div>
            ) : alreadyConsented ? (
              <div className="card p-8 text-center">
                <ShieldCheck className="w-12 h-12 text-green-mid mx-auto mb-4" />
                <h2 className="text-green-dark mb-3">Consent Already Confirmed</h2>
                <p className="text-gray-muted text-sm">
                  Consent for {app!.first_name} {app!.last_name} has already been confirmed. No further action is needed.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-amber-light border-l-4 border-amber rounded-r-lg p-5 mb-6">
                  <h2 className="text-green-dark text-lg font-semibold mb-3">
                    Parental Consent Required for {app!.first_name} {app!.last_name}
                  </h2>
                  <p className="text-sm text-gray-body mb-3">
                    {app!.first_name} has applied to Tee&rsquo;s House&rsquo;s mentorship program.
                    Because they are under 18, we need a parent or guardian&rsquo;s consent before
                    they can be paired with a mentor. Here&rsquo;s how we keep participants safe:
                  </p>
                  <ul className="text-sm text-gray-body space-y-1.5 list-disc pl-5">
                    <li>All session activity is logged and visible to Tee&rsquo;s House administrators.</li>
                    <li>In-person sessions require a parent/guardian to be present or nearby.</li>
                    <li>All written communication happens through the Tee&rsquo;s House portal only — never personal email or social media.</li>
                    <li>You may withdraw your consent at any time by contacting info@teeshouse.org.</li>
                    <li>Consent is renewed annually for as long as your child participates.</li>
                  </ul>
                </div>
                <ConsentForm token={params.token} applicantName={`${app!.first_name} ${app!.last_name}`} />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
