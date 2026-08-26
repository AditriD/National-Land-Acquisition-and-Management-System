'use client'
import { LucideIcon, Home, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export function DashboardLayout({
  title,
  role,
  children,
}: {
  title: string
  role: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
          {role}
        </span>
      </div>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}