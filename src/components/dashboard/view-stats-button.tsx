import Link from 'next/link'
import { BarChart3 } from 'lucide-react'

export function ViewStatsButton() {
  return (
    <Link
      href="/stats"
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gold text-navy-dark text-sm font-semibold hover:bg-gold-light transition-colors"
    >
      <BarChart3 className="w-4 h-4" /> View Statistics
    </Link>
  )
}
