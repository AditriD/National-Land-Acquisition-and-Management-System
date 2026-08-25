import Link from 'next/link'

export function ViewStatsButton() {
  return (
    <Link
      href="/stats"
      className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
    >
      View Statistics
    </Link>
  )
}