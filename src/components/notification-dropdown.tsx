'use client'

import { useState } from 'react'
import { Bell, Check, FileText, AlertTriangle, MapPin, Clock } from 'lucide-react'

type Notification = {
  id: string
  icon: typeof Bell
  title: string
  desc: string
  time: string
  unread: boolean
  color: string
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: AlertTriangle,
    title: 'High Risk Alert',
    desc: 'Parcel 42-B in Bihar Highway project flagged as HIGH risk due to dispute.',
    time: '12 min ago',
    unread: true,
    color: 'text-red-500',
  },
  {
    id: '2',
    icon: FileText,
    title: 'Document Uploaded',
    desc: 'Land record document uploaded for Parcel 18-A, West Bengal Irrigation.',
    time: '1 hr ago',
    unread: true,
    color: 'text-blue-500',
  },
  {
    id: '3',
    icon: MapPin,
    title: 'Stage Advanced',
    desc: 'Parcel 7-C moved from SCRUTINY to SIA stage in Rajasthan Railway project.',
    time: '3 hrs ago',
    unread: true,
    color: 'text-emerald-500',
  },
  {
    id: '4',
    icon: Clock,
    title: 'Deadline Approaching',
    desc: 'Target completion for Gujarat Highway project is due in 14 days.',
    time: '6 hrs ago',
    unread: false,
    color: 'text-amber-500',
  },
  {
    id: '5',
    icon: FileText,
    title: 'Compensation Approved',
    desc: 'Compensation for Parcel 11-D in UP Irrigation has been approved for disbursement.',
    time: '1 day ago',
    unread: false,
    color: 'text-emerald-500',
  },
]

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => n.unread).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-semibold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white text-slate-700 shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-navy-dark">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-navy-dark font-medium hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => toggleNotification(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 cursor-pointer transition-colors ${
                    n.unread ? 'bg-navy-dark/5 hover:bg-navy-dark/8' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`mt-0.5 ${n.color}`}>
                    <n.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-snug ${n.unread ? 'font-semibold text-navy-dark' : 'text-slate-700'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                  {n.unread && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-navy-dark shrink-0" />
                  )}
                </li>
              ))}
            </ul>
            <div className="px-4 py-2.5 text-center border-t border-slate-100">
              <button
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-navy-dark hover:underline"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}