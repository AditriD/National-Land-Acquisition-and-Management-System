'use client'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Home, LogOut } from 'lucide-react'

export function HeaderBar() {
  const { data: session } = useSession()

  return (
    <header className="p-4 border-b relative flex items-center justify-between">
      <div>
        {session && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        )}
      </div>

    <h1 className="text-base sm:text-lg md:text-xl font-semibold absolute left-1/2 -translate-x-1/2 whitespace-nowrap max-w-[60vw] truncate text-center">
        Land Acquisition & Management System
    </h1>

      <div>
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        )}
      </div>
    </header>
  )
}