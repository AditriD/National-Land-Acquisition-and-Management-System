// src/app/stats/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getScopedStats } from '@/lib/dashboard-stats'
import { StageChart } from '@/components/dashboard/stage-chart'
import { RiskChart } from '@/components/dashboard/risk-chart'
import { SectorChart } from '@/components/dashboard/sector-chart'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'

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
    <DashboardLayout title={`${scopeLabel} Statistics`} role={session.user.role}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <StageChart data={byStage} />
        </Card>
        <Card className="p-6">
          <RiskChart data={byRisk} />
        </Card>
        <Card className="p-6 md:col-span-2">
          <SectorChart data={bySector} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
