import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { AdvanceStageButton } from '@/components/advance-stage-button'
import { StatusTimeline } from '@/components/status-timeline'
import { DocumentUploadForm } from '@/components/documents/document-upload-form'

const riskColor: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
}

const RISK_BOX_STYLES: Record<string, string> = {
  LOW: 'border-green-200 bg-green-50',
  MEDIUM: 'border-yellow-200 bg-yellow-50',
  HIGH: 'border-red-200 bg-red-50',
}

const CAN_ADVANCE = ['DISTRICT', 'STATE', 'CENTRAL', 'ADMIN']
const CAN_CREATE_PARCEL = ['DISTRICT', 'STATE', 'AGENCY']

export default async function ParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const parcel = await prisma.landParcel.findUnique({
    where: { id },
    include: {
      project: true,
      statusHistory: { orderBy: { changedAt: 'desc' } },
      documents: { orderBy: { uploadedAt: 'desc' } },
    },
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
            <div className={`rounded-lg p-3 flex items-start gap-3 border ${RISK_BOX_STYLES[parcel.riskLevel]}`}>
              <Badge className={riskColor[parcel.riskLevel]}>{parcel.riskLevel}</Badge>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Risk Reason</p>
                <p className="text-sm text-slate-700">{parcel.riskReason}</p>
              </div>
            </div>
          )}
          {session && CAN_ADVANCE.includes(session.user.role) && (
            <AdvanceStageButton parcelId={parcel.id} currentStage={parcel.status} />
          )}

          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-2">Documents</h3>
            {parcel.documents.length === 0 ? (
              <p className="text-sm text-slate-400 mb-2">No documents uploaded yet.</p>
            ) : (
              <ul className="mb-2 space-y-1">
                {parcel.documents.map((doc) => (
                  <li key={doc.id} className="text-sm">
                    <a href={doc.fileUrl} target="_blank" className="text-blue-600 hover:underline">
                      {doc.docType} (v{doc.version})
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <DocumentUploadForm parcelId={parcel.id} />
          </div>
        </div>
        <StatusTimeline history={parcel.statusHistory} />
      </div>
    </DashboardLayout>
  )
}