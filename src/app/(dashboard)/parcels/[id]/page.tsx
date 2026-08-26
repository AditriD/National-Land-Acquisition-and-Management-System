import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { AdvanceStageButton } from '@/components/advance-stage-button'
import { StatusTimeline } from '@/components/status-timeline'
import { DocumentUploadForm } from '@/components/documents/document-upload-form'
import { BackButton } from '@/components/back-button'
import { Card } from '@/components/ui/card'
import { FileText, ExternalLink } from 'lucide-react'

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
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Card className="p-6 bg-navy-dark text-white border-navy-dark">
            <h2 className="text-lg font-bold">{parcel.project.name}</h2>
            <p className="text-sm text-slate-300 mt-1">
              Survey No: {parcel.surveyNumber} &middot; {parcel.areaHectares} ha
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="gov-badge bg-gold/20 text-gold border border-gold/30">
                {parcel.status.replace(/_/g, ' ')}
              </span>
              <span className="gov-badge bg-white/10 text-white border border-white/20">
                Compensation: {parcel.compensationStatus}
              </span>
            </div>
          </Card>

          {parcel.riskLevel && (
            <div className={`rounded-xl p-4 flex items-start gap-3 border ${RISK_BOX_STYLES[parcel.riskLevel]}`}>
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

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-navy" />
              <h3 className="font-semibold text-navy-dark text-sm">Documents</h3>
            </div>
            {parcel.documents.length === 0 ? (
              <p className="text-sm text-slate-400 mb-2">No documents uploaded yet.</p>
            ) : (
              <ul className="mb-3 space-y-2">
                {parcel.documents.map((doc) => (
                  <li key={doc.id} className="text-sm flex items-center gap-2">
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    <a href={doc.fileUrl} target="_blank" className="text-gold hover:text-gold-light font-medium transition-colors">
                      {doc.docType} (v{doc.version})
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <DocumentUploadForm parcelId={parcel.id} />
          </Card>
        </div>
        <StatusTimeline history={parcel.statusHistory} />
      </div>
    </DashboardLayout>
  )
}
