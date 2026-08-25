// src/app/stats/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getScopedStats } from '@/lib/dashboard-stats'
import { StageChart } from '@/components/dashboard/stage-chart'
import { RiskChart } from '@/components/dashboard/risk-chart'
import { SectorChart } from '@/components/dashboard/sector-chart'
import { redirect } from 'next/navigation'

export default async function StatsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role === 'CITIZEN') redirect('/')

  const { byStage, byRisk, bySector } = await getScopedStats(session.user)

  const scopeLabel =
    session.user.role === 'CENTRAL' || session.user.role === 'ADMIN'
      ? 'National'
      : session.user.role === 'STATE'
        ? session.user.state ?? 'State'
        : session.user.role === 'DISTRICT'
          ? session.user.district ?? 'District'
          : session.user.agencyName ?? 'Agency'

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{scopeLabel} Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <StageChart data={byStage} />
        </div>
        <div className="border rounded-lg p-4">
          <RiskChart data={byRisk} />
        </div>
        <div className="border rounded-lg p-4 md:col-span-2">
          <SectorChart data={bySector} />
        </div>
      </div>
    </div>
  )
}