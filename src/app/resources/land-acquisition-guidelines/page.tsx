import Link from 'next/link'
import { ArrowLeft, ClipboardList } from 'lucide-react'

export default function LandAcquisitionGuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/resources/guidelines.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy-dark/70" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Land Acquisition Guidelines</h1>
              <p className="text-slate-300 text-sm mt-1">Procedural guidance for requiring bodies and implementing agencies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-navy-dark mb-4">Guidelines Overview</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            These guidelines provide step-by-step procedural guidance for government bodies and
            implementing agencies involved in the land acquisition process under the RFCTLARR Act, 2013.
          </p>

          <h3 className="text-lg font-semibold text-navy-dark mb-3">Sections</h3>
          <div className="space-y-3 mb-6">
            {[
              { title: 'Pre-Acquisition Phase', desc: 'Planning, feasibility studies, and Social Impact Assessment procedures.' },
              { title: 'Notification & Hearing', desc: 'Requirements for public notification and hearing processes.' },
              { title: 'Award & Compensation', desc: 'Methods for determining compensation and making awards.' },
              { title: 'Rehabilitation & Resettlement', desc: 'Implementation of R&R packages for affected families.' },
              { title: 'Possession & Transfer', desc: 'Procedures for taking possession and transferring land.' },
            ].map((s) => (
              <div key={s.title} className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                <h4 className="font-semibold text-navy-dark text-sm">{s.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-navy-dark font-medium">Content coming soon</p>
            <p className="text-xs text-slate-500 mt-1">
              Detailed procedural guidelines will be published here.
              For current guidelines, please contact the Ministry of Rural Development.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
