import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react'

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/resources/contact.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy-dark/70" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <Phone className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Contact &amp; Support</h1>
              <p className="text-slate-300 text-sm mt-1">Reach the platform support team for assistance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-navy-dark mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <p className="font-semibold text-navy-dark text-sm">Helpline</p>
                  <p className="text-sm text-slate-600">1800-XXX-XXXX (Toll Free)</p>
                  <p className="text-xs text-slate-400">Mon-Fri, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <p className="font-semibold text-navy-dark text-sm">Email</p>
                  <p className="text-sm text-slate-600">support-nlams@nic.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <p className="font-semibold text-navy-dark text-sm">Address</p>
                  <p className="text-sm text-slate-600">
                    Ministry of Rural Development<br />
                    Krishi Bhawan, New Delhi - 110001
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-navy-dark mb-4">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none" placeholder="How can we help?" />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg bg-gold text-navy-dark font-semibold hover:bg-gold-light transition-colors text-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
