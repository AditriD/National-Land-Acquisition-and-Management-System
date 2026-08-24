import { LucideIcon } from 'lucide-react'

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
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-lg text-slate-900">
            Land Acquisition & Management System
          </h1>
          <p className="text-sm text-slate-500">{title}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
            {role}
          </span>
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}