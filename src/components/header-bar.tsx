'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Landmark, ChevronDown, UserCircle, LogOut, LayoutDashboard } from 'lucide-react'
import { NotificationDropdown } from '@/components/notification-dropdown'

const roleHome: Record<string, string> = {
  CENTRAL: '/central',
  STATE: '/state',
  DISTRICT: '/district',
  AGENCY: '/agency',
  ADMIN: '/admin',
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/dashboard' },
  { label: 'GIS Map', href: '/dashboard' },
  { label: 'Citizen Lookup', href: '/citizen-lookup' },
  { label: 'Resources', href: '/resources' },
]

function roleLabel(role?: string) {
  if (!role) return ''
  return role.charAt(0) + role.slice(1).toLowerCase()
}

export function HeaderBar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isHome = pathname === '/'

  const homeHref = session ? (roleHome[session.user.role] ?? '/') : '/'

  const displayLinks = NAV_LINKS

  return (
    <header
      className={
        isHome
          ? 'absolute top-0 inset-x-0 z-50 bg-gradient-to-b from-navy-dark/80 via-navy-dark/50 to-transparent'
          : 'relative z-50 bg-navy-dark text-white border-b border-white/10'
      }
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4 text-white">
        {/* LOGO */}
        <Link href={homeHref} className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-gold" />
          </span>
          <span className="leading-tight hidden sm:block">
            <span className="block text-sm font-semibold">Ministry of Rural Development</span>
            <span className="block text-[11px] text-slate-300">Government of India</span>
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden lg:flex items-center gap-1">
          {displayLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3 shrink-0">
          {session?.user && (
            <NotificationDropdown />
          )}

          {session?.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <UserCircle className="w-5 h-5" />
                </span>
                <span className="hidden md:block text-left leading-tight">
                  <span className="block text-sm font-semibold">
                    {session.user.name || `${roleLabel(session.user.role)} Officer`}
                  </span>
                  <span className="block text-[10px] tracking-wide text-slate-300">
                    {session.user.role}
                  </span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white text-slate-700 shadow-lg border border-slate-200 py-1 z-50">
                  <Link
                    href={homeHref}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold bg-navy-dark text-white px-4 py-1.5 rounded-md hover:bg-navy transition-colors"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
