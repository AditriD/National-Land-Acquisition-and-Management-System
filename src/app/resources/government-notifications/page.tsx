import Link from 'next/link'
import { ArrowLeft, Bell } from 'lucide-react'

export default function GovernmentNotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/resources/notifications.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy-dark/70" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <Bell className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Government Notifications</h1>
              <p className="text-slate-300 text-sm mt-1">Official notifications relevant to ongoing land acquisitions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-navy-dark mb-4">Notifications</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Official government notifications related to land acquisition under the RFCTLARR Act, 2013.
            These include acquisition notices, hearing schedules, and award declarations.
          </p>

          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">No notifications yet</p>
            <p className="text-xs text-slate-400 mt-1">Notifications will be listed here as they are published.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
