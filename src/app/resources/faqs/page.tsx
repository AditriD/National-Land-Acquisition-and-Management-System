import Link from 'next/link'
import { ArrowLeft, HelpCircle } from 'lucide-react'

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/resources/faqs.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy-dark/70" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Frequently Asked Questions</h1>
              <p className="text-slate-300 text-sm mt-1">Answers to common questions from citizens and officials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-navy-dark mb-6">FAQs</h2>

          <div className="space-y-4">
            {[
              {
                q: 'How do I check the status of my land acquisition?',
                a: 'Use the Citizen Lookup feature on the platform. Enter your survey number and registered phone number to receive an OTP and view your parcel status.',
              },
              {
                q: 'Who can create new projects on the platform?',
                a: 'Only CENTRAL and STATE level officers have permission to create new land acquisition projects.',
              },
              {
                q: 'How is the risk level of a parcel determined?',
                a: 'Risk levels (LOW, MEDIUM, HIGH) are determined by the AI-assisted risk detection system based on factors like delays, disputes, and stage progression.',
              },
              {
                q: 'What are the stages of land acquisition?',
                a: 'The 7 stages are: Proposal Submitted, Under Scrutiny, Notification Issued, Award Declared, Compensation Disbursed, Possession Taken, and RR Completed.',
              },
            ].map((faq) => (
              <div key={faq.q} className="p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-navy-dark text-sm mb-1">{faq.q}</h4>
                <p className="text-sm text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
