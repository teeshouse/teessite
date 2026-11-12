import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MentorshipApplyForm from "@/components/mentorship/MentorshipApplyForm"

export const metadata = {
  title: "Apply as an Intern | Tee's House",
  description: "Apply as an intern and be paired with a mentor through the Tee's House internship program.",
}

export default function MentorshipApplyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative text-white py-20 px-4 overflow-hidden bg-green-dark">
          <div className="container-max relative text-center z-10">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Intern Application</span>
            <h1 className="text-white mt-3 text-3xl md:text-4xl">Apply as an Intern</h1>
          </div>
        </section>
        <MentorshipApplyForm />
      </main>
      <Footer />
    </>
  )
}
