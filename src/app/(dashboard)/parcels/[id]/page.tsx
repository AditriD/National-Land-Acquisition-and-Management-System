import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { AdvanceStageButton } from '@/components/advance-stage-button'
import { StatusTimeline } from '@/components/status-timeline'

const riskColor: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
}

const CAN_ADVANCE = ['DISTRICT', 'STATE', 'CENTRAL', 'ADMIN']

export default async function ParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const parcel = await prisma.landParcel.findUnique({
    where: { id },
    include: { project: true, statusHistory: { orderBy: { changedAt: 'desc' } } },
  })

  if (!parcel) return <div className="p-6">Parcel not found</div>

  return (
    <DashboardLayout title={`Parcel ${parcel.surveyNumber}`} role={session?.user.role ?? ''}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{parcel.project.name}</h2>
          <p className="text-sm text-slate-500">
            Survey No: {parcel.surveyNumber} · {parcel.areaHectares} ha
          </p>
          <p>Stage: <span className="font-medium">{parcel.status}</span></p>
          <p>Compensation status: {parcel.compensationStatus}</p>
          {parcel.riskLevel && (
            <>
              <Badge className={riskColor[parcel.riskLevel]}>{parcel.riskLevel}</Badge>
              <p className="text-sm text-slate-600">{parcel.riskReason}</p>
            </>
          )}
          {session && CAN_ADVANCE.includes(session.user.role) && (
            <AdvanceStageButton parcelId={parcel.id} currentStage={parcel.status} />
          )}
        </div>
        <StatusTimeline history={parcel.statusHistory} />
      </div>
    </DashboardLayout>
  )
}