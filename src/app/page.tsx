import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDashboardPath } from '@/lib/ashboard-path'
import { getPublicHomeStats } from '@/lib/public-stats'
import { ProgressDonut } from '@/components/progress-donut'
import {
  ArrowRight, Search, Layers, MapPin, ShieldAlert, Users,
  Map as MapIcon, FileText, Scale, Compass,
  ClipboardList, FileSearch, Megaphone, Gavel, Wallet, Home as HomeIcon,
  ChevronRight,
} from 'lucide-react'

const LIFECYCLE = [
  { icon: ClipboardList, title: 'Proposal', desc: 'Requiring body submits an acquisition proposal under the RFCTLARR Act, 2013.' },
  { icon: FileSearch, title: 'Scrutiny', desc: 'District and state authorities review feasibility and land records.' },
  { icon: Users, title: 'Social Impact Assessment', desc: 'Impact on affected families and public interest is assessed.' },
  { icon: Megaphone, title: 'Notification', desc: 'Formal notification of intent to acquire is issued.' },
  { icon: Gavel, title: 'Award', desc: 'Compensation amount is legally declared for each parcel.' },
  { icon: Wallet, title: 'Compensation', desc: 'Compensation is disbursed to affected landowners.' },
  { icon: HomeIcon, title: 'Possession', desc: 'Land is taken into possession and R&R is completed.' },
]

const FEATURES = [
  {
    icon: MapIcon,
    title: 'GIS Mapping',
    desc: 'Real-time land parcel visualization and spatial analysis.',
    image: '/images/features/gis-mapping.jpg',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Tailored dashboards for Agency, State, District and Central users.',
    image: '/images/features/role-based-access.jpg',
  },
  {
    icon: ShieldAlert,
    title: 'AI-Assisted Risk Detection',
    desc: 'Early warning for delays, disputes and acquisition risks.',
    image: '/images/features/risk-detection.jpg',
  },
  {
    icon: FileText,
    title: 'Document Management',
    desc: 'Secure upload, review and tracking of land records.',
    image: '/images/features/document-management.jpg',
  },
  {
    icon: Scale,
    title: 'Transparent Workflow',
    desc: 'End-to-end tracking from proposal to possession.',
    image: '/images/features/transparent-workflow.jpg',
  },
]

const RESOURCES = [
  { title: 'RFCTLARR Act, 2013', desc: 'The governing legislation for fair compensation and transparency in land acquisition.' },
  { title: 'Land Acquisition Guidelines', desc: 'Procedural guidance for requiring bodies and implementing agencies.' },
  { title: 'Government Notifications', desc: 'Official notifications relevant to ongoing acquisitions.' },
  { title: 'User Manuals', desc: 'Step-by-step guides for each role on the platform.' },
  { title: 'FAQs', desc: 'Answers to common questions from citizens and officials.' },
  { title: 'Contact & Support', desc: 'Reach the platform support team for assistance.' },
]

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  const stats = await getPublicHomeStats()
  const exploreHref = session ? getDashboardPath(session.user.role) : '/login'

  const liveStatus = [
    { label: 'Under Scrutiny', value: stats.liveStatus.underScrutiny, color: 'bg-emerald-400' },
    { label: 'Notification Issued', value: stats.liveStatus.notificationIssued, color: 'bg-blue-400' },
    { label: 'Compensation Pending', value: stats.liveStatus.compensationPending, color: 'bg-amber-400' },
    { label: 'Possession Taken', value: stats.liveStatus.possessionTaken, color: 'bg-yellow-500' },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* ---------- HERO ---------- */}
      <section className="relative bg-navy-dark text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-land-survey.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/85 from-5% via-navy-dark/55 via-40% to-navy-dark/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-4">
              Ministry of Rural Development &middot; Government of India
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              National Land Acquisition
              <br /> &amp; Management System
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              A unified platform to digitize land acquisition — from proposal to
              possession — with GIS mapping, role-based visibility, and
              AI-assisted risk detection.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={exploreHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gold text-navy-dark font-semibold hover:bg-gold-light transition-colors"
              >
                Explore Platform <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/citizen-lookup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-white/25 text-white font-medium hover:bg-white/10 transition-colors"
              >
                <Search className="w-4 h-4" /> Citizen Lookup
              </Link>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:absolute lg:top-16 lg:right-6 w-full lg:w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">Live Project Status</h3>
            <ul className="space-y-3">
              {liveStatus.map((s) => (
                <li key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className={`w-2 h-2 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                  <span className="text-white font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Layers} label="Total Projects" value={stats.totalProjects} />
            <StatCard icon={MapPin} label="Total Parcels" value={stats.totalParcels} />
            <StatCard icon={ShieldAlert} label="High Risk" value={stats.highRisk} />
            <StatCard icon={Users} label="Disputed" value={stats.disputed} />
          </div>
        </div>

        {/* curved wave transition into the white section below */}
        <svg
          className="absolute bottom-0 left-0 w-full h-12 md:h-20 text-white pointer-events-none"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,55 C320,100 1120,0 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </section>

      <div className="h-6 md:h-10" />

      {/* ---------- KEY FEATURES + SYSTEM AT A GLANCE ---------- */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-16 md:pb-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-dark mb-2">Key Features</h2>
          <p className="text-sm text-slate-500 tracking-wide">
            Transparency &nbsp;&bull;&nbsp; Efficiency &nbsp;&bull;&nbsp; Citizen Trust
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-slate-200 overflow-hidden hover:border-gold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div
                  className="relative h-28 w-full bg-navy-dark bg-cover bg-center"
                  style={{ backgroundImage: `url('${f.image}'), linear-gradient(135deg, var(--navy-dark), var(--navy))` }}
                >
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold transition-colors">
                    <f.icon className="w-4 h-4 text-gold group-hover:text-navy-dark transition-colors" />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-navy-dark mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">{f.desc}</p>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-gold self-end mt-3 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 rounded-2xl border border-slate-200 p-5 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 self-start text-sm font-semibold text-navy-dark mb-4">
              <Compass className="w-4 h-4 text-gold" /> System at a Glance
            </div>
            <ProgressDonut
              completed={stats.progress.completed}
              inProgress={stats.progress.inProgress}
              pending={stats.progress.pending}
              overallProgressPct={stats.progress.overallProgressPct}
            />
            <p className="text-xs text-slate-500 mt-2 mb-4">Overall Progress</p>
            <ul className="w-full space-y-2 text-xs text-left">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" />Completed</span>
                <span className="font-semibold">{stats.progress.completed}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" />In Progress</span>
                <span className="font-semibold">{stats.progress.inProgress}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" />Pending</span>
                <span className="font-semibold">{stats.progress.pending}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- LIFECYCLE ---------- */}
      <section id="lifecycle" className="bg-navy-dark text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Land Acquisition Lifecycle</h2>
              <p className="text-slate-400 text-sm">A 7-stage transparent and trackable process</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-xs">
              <p className="text-sm font-semibold mb-1">Need Help?</p>
              <p className="text-xs text-slate-400 mb-4">Track your land acquisition status or get support.</p>
              <Link
                href="/citizen-lookup"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-dark bg-gold px-4 py-2 rounded-md hover:bg-gold-light transition-colors"
              >
                Citizen Lookup <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="hidden md:block relative">
            <svg
              className="absolute left-0 right-0 top-6 w-full h-10 -translate-y-1/2 pointer-events-none"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,5 Q8.33,0 16.67,5 T33.33,5 T50,5 T66.67,5 T83.33,5 T100,5"
                stroke="var(--gold)"
                strokeWidth="0.5"
                strokeDasharray="2.2 2.2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
            <div className="flex items-start justify-between relative">
              {LIFECYCLE.map((stage, i) => (
                <div key={stage.title} className="relative flex flex-col items-center text-center w-full px-2">
                  {i < LIFECYCLE.length - 1 && (
                    <ChevronRight className="absolute top-6 -right-1 -translate-y-1/2 w-4 h-4 text-gold/70 z-10" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-navy-dark border-2 border-gold flex items-center justify-center mb-3 z-10">
                    <stage.icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-sm font-semibold">
                    <span className="text-gold">{i + 1}.</span> {stage.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden space-y-6">
            {LIFECYCLE.map((stage, i) => (
              <div key={stage.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-navy-dark border-2 border-gold flex items-center justify-center shrink-0">
                    <stage.icon className="w-4 h-4 text-gold" />
                  </div>
                  {i < LIFECYCLE.length - 1 && <div className="w-px flex-1 bg-white/15 my-1" />}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-semibold mb-1">
                    <span className="text-gold">{i + 1}.</span> {stage.title}
                  </p>
                  <p className="text-xs text-slate-400">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-navy-dark mb-4">About the Platform</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Built for the Ministry of Rural Development, this platform brings every stage of
          land acquisition under the RFCTLARR Act, 2013 onto a single, transparent system —
          from the initial proposal through Social Impact Assessment, notification, award,
          compensation and possession — with GIS-mapped parcels, role-based dashboards for
          Central, State, District and Agency officials, and AI-assisted risk detection to
          flag delays and disputes early.
        </p>
      </section>

      {/* ---------- RESOURCES ---------- */}
      <section id="resources" className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy-dark mb-8 text-center">Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESOURCES.map((r) => (
              <div key={r.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-gold transition-colors">
                <h3 className="font-semibold text-navy-dark text-sm mb-1.5">{r.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-6">
            Documents and links will be published here as they become available.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        Built for Smart India Hackathon 2026 &middot; Problem Statement SIH26016
      </footer>
    </main>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl pt-3 pb-4 px-4 hover:border-gold/60 transition-colors">
      <Icon className="w-5 h-5 text-gold mb-2" />
      <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-300 mt-0.5">{label}</p>
    </div>
  )
}