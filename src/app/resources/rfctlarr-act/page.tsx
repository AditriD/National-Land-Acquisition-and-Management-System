import Link from 'next/link'
import { ArrowLeft, Scale } from 'lucide-react'

export default function RFCTLARRActPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/resources/rfctlarr.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy-dark/70" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <Scale className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">RFCTLARR Act, 2013</h1>
              <p className="text-slate-300 text-sm mt-1">The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-navy-dark mb-4">About the Act</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            The RFCTLARR Act, 2013 is the governing legislation for fair compensation and transparency
            in land acquisition, rehabilitation and resettlement in India. It was enacted to ensure
            that land acquisition for public purposes is carried out in a fair and transparent manner,
            with adequate compensation and rehabilitation for affected families.
          </p>

          <h3 className="text-lg font-semibold text-navy-dark mb-3">Key Provisions</h3>
          <ul className="space-y-3 mb-6">
            {[
              'Social Impact Assessment (SIA) for all acquisitions',
              'Consent of 80% of affected families for private projects',
              'Fair compensation at 2x market value in rural areas, 1x in urban areas',
              'Rehabilitation and Resettlement package for affected families',
              'Special provisions for food security, defense, and emergency situations',
              'Right to return unused land after 5 years',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-navy-dark font-medium">Content coming soon</p>
            <p className="text-xs text-slate-500 mt-1">
              The full text of the Act and related official documents will be published here.
              For the complete act, refer to the official Gazette of India.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
