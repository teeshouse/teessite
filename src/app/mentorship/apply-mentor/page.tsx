import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MentorApplyForm from "@/components/mentorship/MentorApplyForm"

export const metadata = {
  title: "Become a Mentor | Tee's House",
  description: "Apply to become a mentor with Tee's House and help shape the next generation of Pensacola youth.",
}

export default function MentorApplyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative text-white py-20 px-4 overflow-hidden bg-green-dark">
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Mentor Application</span>
            <h1 className="text-white mt-3 text-3xl md:text-4xl">Become a Mentor</h1>
          </div>
        </section>
        <MentorApplyForm />
      </main>
      <Footer />
    </>
  )
}
