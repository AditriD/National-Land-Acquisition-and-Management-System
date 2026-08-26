import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ResourcesIndexPage() {
  const resources = [
    {
      title: 'RFCTLARR Act, 2013',
      desc: 'The governing legislation for fair compensation and transparency in land acquisition.',
      href: '/resources/rfctlarr-act',
      icon: '⚖',
    },
    {
      title: 'Land Acquisition Guidelines',
      desc: 'Procedural guidance for requiring bodies and implementing agencies.',
      href: '/resources/land-acquisition-guidelines',
      icon: '📋',
    },
    {
      title: 'Government Notifications',
      desc: 'Official notifications relevant to ongoing acquisitions.',
      href: '/resources/government-notifications',
      icon: '🔔',
    },
    {
      title: 'User Manuals',
      desc: 'Step-by-step guides for each role on the platform.',
      href: '/resources/user-manuals',
      icon: '📖',
    },
    {
      title: 'FAQs',
      desc: 'Answers to common questions from citizens and officials.',
      href: '/resources/faqs',
      icon: '❓',
    },
    {
      title: 'Contact & Support',
      desc: 'Reach the platform support team for assistance.',
      href: '/resources/contact-support',
      icon: '📞',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white py-10">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-display text-3xl font-bold">Resources</h1>
          <p className="text-slate-300 text-sm mt-2 max-w-xl">
            Official documentation, guidelines, and support for the National Land Acquisition &amp; Management System.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-gold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <span className="text-xl">{r.icon}</span>
              </div>
              <h3 className="font-semibold text-navy-dark mb-1.5 group-hover:text-gold transition-colors">{r.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
