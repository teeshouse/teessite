import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ContactForm from "@/components/ContactForm"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata = {
  title: "Contact | Tee's House",
  description: "Get in touch with Tee's House. We'd love to hear from you.",
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative bg-green-dark text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4A7C2F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C8860A 0%, transparent 40%)" }} />
          <div className="container-max relative text-center">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Reach Out</span>
            <h1 className="text-white mt-3 mb-4 text-4xl md:text-5xl">Contact Us</h1>
            <p className="text-green-light text-lg max-w-xl mx-auto">
              Our doors are open. Whether you want to volunteer, partner, or learn more we would love to hear from you.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Info */}
              <div>
                <h2 className="text-green-dark mb-6">Get In Touch</h2>
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-green-light rounded-lg shrink-0">
                      <MapPin className="w-5 h-5 text-green-mid" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-body">Location</p>
                      <p className="text-gray-muted text-sm">Pensacola, Florida</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-green-light rounded-lg shrink-0">
                      <Phone className="w-5 h-5 text-green-mid" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-body">Phone</p>
                      <a href="tel:8502911888" className="text-gray-muted text-sm hover:text-green-mid transition-colors">
                        850.291.1888
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-green-light rounded-lg shrink-0">
                      <Mail className="w-5 h-5 text-green-mid" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-body">Email</p>
                      <a href="mailto:info@teeshouse.org" className="text-gray-muted text-sm hover:text-green-mid transition-colors">
                        info@teeshouse.org
                      </a>
                    </div>
                  </li>
                </ul>
                <div className="bg-green-light rounded-card p-6">
                  <p className="font-display italic text-green-dark text-lg">
                    "Together, we can keep growing — one seed, one idea, one heart at a time."
                  </p>
                </div>
              </div>

              {/* Form (client component) */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
