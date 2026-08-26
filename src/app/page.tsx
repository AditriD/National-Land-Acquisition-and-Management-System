import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-white to-slate-50">
      <p className="text-sm font-medium text-blue-600 mb-3">
        Ministry of Rural Development
      </p>
      <h1 className="text-4xl font-bold tracking-tight mb-4 max-w-2xl">
        National Land Acquisition & Management System
      </h1>
      <p className="text-slate-600 max-w-xl mb-8">
        A unified platform to digitize land acquisition — from proposal to
        possession — with GIS mapping, role-based visibility, and
        AI-assisted risk detection.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        <Link
          href="/signup"
          className="inline-flex items-center px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-100"
        >
          Sign In
        </Link>
        <Link
          href="/citizen-lookup"
          className="inline-flex items-center px-6 py-3 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-100"
        >
          Citizen Lookup
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mb-16">
        {[
          ['Multi-State', 'Highway, Railway & Irrigation projects'],
          ['GIS Mapped', 'Live parcel-level location tracking'],
          ['AI Risk Scoring', 'Predictive delay & dispute detection'],
          ['Role-Based Access', 'Central to district-level visibility'],
        ].map(([title, desc]) => (
          <div key={title} className="border rounded-lg p-4 text-left bg-white">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl text-left w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['1. Proposal', 'A requiring body submits a land acquisition request under the RFCTLARR Act, 2013.'],
            ['2. Award & Compensation', 'Notification is issued, compensation is assessed and disbursed to landowners.'],
            ['3. Possession & R&R', 'Land is taken into possession and rehabilitation & resettlement is completed.'],
          ].map(([title, desc]) => (
            <div key={title} className="p-4">
              <h3 className="font-medium text-sm mb-1">{title}</h3>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-16">
        Built for Smart India Hackathon 2026 · Problem Statement SIH26016
      </p>
    </main>
  )
}
