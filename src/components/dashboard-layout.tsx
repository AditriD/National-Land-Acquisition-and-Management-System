'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/road.jpg"
          alt="Dashboard background"
          fill
          className="object-cover"
          priority
        />

        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-slate-50/60" />
      </div>

      {/* Dashboard Title Bar */}
      <div className="bg-[#1F2D46] border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={session ? (roleHome[session.user.role] ?? '/') : '/'}
            className="flex items-center gap-4"
          >
            <span className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Landmark className="w-8 h-8 text-slate-200" />
            </span>

            <h2 className="text-3xl font-bold text-white">
              {title}
            </h2>
          </Link>
        </div>

        <span className="text-base px-6 py-2 bg-navy-dark/80 text-slate-200 border border-white/15 rounded-full font-medium tracking-wide">
          {role}
        </span>
      </div>

      {/* Dashboard Content */}
      <main className="relative p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}