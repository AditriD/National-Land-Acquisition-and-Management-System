import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function UserManualsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/resources/manuals.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy-dark/70" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">User Manuals</h1>
              <p className="text-slate-300 text-sm mt-1">Step-by-step guides for each role on the platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-navy-dark mb-4">Platform User Guides</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Comprehensive user manuals for each role on the NLAMS platform.
          </p>

          <div className="space-y-3 mb-6">
            {[
              { role: 'Central Officer', desc: 'National-level oversight and project management.' },
              { role: 'State Officer', desc: 'State-level project and parcel management.' },
              { role: 'District Officer', desc: 'District-level parcel management and data entry.' },
              { role: 'Agency Officer', desc: 'Implementing agency project tracking.' },
              { role: 'Citizen', desc: 'Land status lookup and tracking.' },
            ].map((m) => (
              <div key={m.role} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-dark text-sm">{m.role}</h4>
                  <p className="text-xs text-slate-500">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-navy-dark font-medium">Content coming soon</p>
            <p className="text-xs text-slate-500 mt-1">
              Detailed user manuals with screenshots will be published here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
