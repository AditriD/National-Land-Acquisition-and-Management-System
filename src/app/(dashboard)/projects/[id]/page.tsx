import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/back-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, MapPin, ShieldAlert, Users, Plus } from 'lucide-react'

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
  MEDIUM: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  HIGH: 'bg-red-100 text-red-700 hover:bg-red-100',
}

const CAN_CREATE_PARCEL = ['DISTRICT', 'STATE']

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      parcels: {
        orderBy: { enteredStageAt: 'desc' },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const totalParcels = project.parcels.length
  const highRiskCount = project.parcels.filter((p) => p.riskLevel === 'HIGH').length
  const disputedCount = project.parcels.filter((p) => p.hasDispute).length
  const compensationPaidCount = project.parcels.filter(
    (p) => p.compensationStatus === 'PAID'
  ).length

  return (
    <DashboardLayout title={project.name} role={session?.user.role ?? ''}>
      <div className="mb-6">
        <BackButton />
      </div>

      <Card className="p-6 mb-6 bg-navy-dark text-white border-navy-dark">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold">{project.name}</h1>
            <p className="text-sm text-slate-300 mt-1">
              {project.sector} &bull; {project.state} &bull; {project.implementingAgency}
            </p>
          </div>
          <Badge variant="outline" className="bg-gold/20 text-gold border-gold/30">{project.ministry}</Badge>
        </div>
        {project.targetCompletion && (
          <p className="text-sm text-slate-300 mt-4">
            Target completion: {new Date(project.targetCompletion).toLocaleDateString()}
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="gov-stat-card group hover:border-gold hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5 text-navy" />
          </div>
          <p className="text-sm text-slate-500">Total Parcels</p>
          <p className="text-3xl font-bold text-navy-dark mt-1">{totalParcels}</p>
        </Card>
        <Card className="gov-stat-card group hover:border-red-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-sm text-slate-500">High Risk</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{highRiskCount}</p>
        </Card>
        <Card className="gov-stat-card group hover:border-amber-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-sm text-slate-500">Disputed</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{disputedCount}</p>
        </Card>
        <Card className="gov-stat-card group hover:border-green-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-slate-500">Compensation Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {compensationPaidCount}/{totalParcels}
          </p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy-dark">Land Parcels</h2>
        {session && CAN_CREATE_PARCEL.includes(session.user.role) && (
          <Link
            href={`/parcels/new?projectId=${project.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gold text-navy-dark text-sm font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Parcel
          </Link>
        )}
      </div>

      {project.parcels.length === 0 ? (
        <Card className="p-10 text-center text-slate-500">
          No land parcels recorded for this project yet.
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="gov-table-header hover:bg-navy-dark">
                <TableHead className="text-white/80">Survey No.</TableHead>
                <TableHead className="text-white/80">District</TableHead>
                <TableHead className="text-white/80">Stage</TableHead>
                <TableHead className="text-white/80">Compensation</TableHead>
                <TableHead className="text-white/80">Dispute</TableHead>
                <TableHead className="text-white/80">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.parcels.map((parcel) => (
                <TableRow key={parcel.id}>
                  <TableCell>
                    <Link
                      href={`/parcels/${parcel.id}`}
                      className="text-gold hover:text-gold-light font-medium transition-colors"
                    >
                      {parcel.surveyNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{parcel.district ?? '—'}</TableCell>
                  <TableCell className="text-sm">{parcel.status.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-sm">{parcel.compensationStatus}</TableCell>
                  <TableCell>
                    {parcel.hasDispute ? (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Yes</Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {parcel.riskLevel ? (
                      <Badge className={RISK_STYLES[parcel.riskLevel]}>{parcel.riskLevel}</Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </DashboardLayout>
  )
}
