import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import IntakeForm from "@/components/IntakeForm"

export const metadata = {
  title: "Client Intake | Tee's House",
  description: "Tell us about yourself so we can connect you with the right programs and resources at Tee's House.",
}

export default function IntakePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-green-dark text-white py-20 px-4">
          <div className="container-max text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">
              Get Connected
            </span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">
              Client Intake Form
            </h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Tell us a little about yourself so we can match you with the right
              programs and resources.
            </p>
          </div>
        </section>

        {/* Form (client component) */}
        <IntakeForm />
      </main>
      <Footer />
    </>
  )
}
