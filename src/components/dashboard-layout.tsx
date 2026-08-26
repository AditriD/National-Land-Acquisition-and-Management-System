'use client'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Landmark } from 'lucide-react'

const roleHome: Record<string, string> = {
  CENTRAL: '/central',
  STATE: '/state',
  DISTRICT: '/district',
  AGENCY: '/agency',
  ADMIN: '/admin',
}

export function DashboardLayout({
  title,
  role,
  children,
}: {
  title: string
  role: string
  children: React.ReactNode
}) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href={session ? (roleHome[session.user.role] ?? '/') : '/'} className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-gold" />
            </span>
            <h2 className="text-base font-semibold text-white">{title}</h2>
          </Link>
        </div>
        <span className="text-xs px-3 py-1 bg-gold/20 text-gold border border-gold/30 rounded-full font-medium tracking-wide">
          {role}
        </span>
      </div>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
