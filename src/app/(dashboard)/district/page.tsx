import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getScopedParcels } from '@/lib/get-scoped-parcels'
import { ParcelMap } from '@/components/parcel-map-client'
import { ViewStatsButton } from '@/components/dashboard/view-stats-button'
import { Building2, MapPin, ShieldAlert, FolderOpen } from 'lucide-react'

const parcels = await getScopedParcels()

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
  MEDIUM: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  HIGH: 'bg-red-100 text-red-700 hover:bg-red-100',
  UNASSESSED: 'bg-gray-100 text-gray-500',
} as const

export default async function DistrictDashboard() {
  const session = await getServerSession(authOptions)
  const district = session?.user.district

  const projects = await prisma.project.findMany({
    where: district ? { parcels: { some: { district } } } : undefined,
    include: {
      parcels: {
        where: district ? { district } : undefined,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalParcels = projects.reduce((sum, p) => sum + p.parcels.length, 0)
  const highRiskCount = projects.reduce(
    (sum, p) => sum + p.parcels.filter((parcel) => parcel.riskLevel === 'HIGH').length,
    0
  )
  const missingDocsCount = projects.reduce(
    (sum, p) =>
      sum +
      p.parcels.filter((parcel) => parcel.hasDispute || parcel.compensationStatus !== 'PAID').length,
    0
  )

  return (
    <DashboardLayout title={`District Dashboard — ${district ?? 'N/A'}`} role="DISTRICT">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-dark">District Overview</h1>
        <ViewStatsButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="gov-stat-card group hover:border-gold hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-3 group-hover:bg-navy/20 transition-colors">
            <Building2 className="w-5 h-5 text-navy" />
          </div>
          <p className="text-sm text-slate-500">Projects Active Here</p>
          <p className="text-3xl font-bold text-navy-dark mt-1">{projects.length}</p>
        </Card>
        <Card className="gov-stat-card group hover:border-gold hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center mb-3 group-hover:bg-gold/25 transition-colors">
            <MapPin className="w-5 h-5 text-gold" />
          </div>
          <p className="text-sm text-slate-500">Parcels in {district ?? 'District'}</p>
          <p className="text-3xl font-bold text-navy-dark mt-1">{totalParcels}</p>
        </Card>
        <Card className="gov-stat-card group hover:border-red-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-sm text-slate-500">High Risk Parcels</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{highRiskCount}</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold text-navy-dark mb-4">Parcel Map</h2>
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <ParcelMap parcels={parcels} />
        </div>
      </Card>

      {/* C2: Projects with parcels in this district */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-bold text-navy-dark mb-4">Projects with Parcels in Your District</h2>
        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">No projects have parcels in your district yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-gold hover:shadow-md transition-all bg-white"
              >
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <FolderOpen className="w-5 h-5 text-navy group-hover:text-gold transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-navy-dark text-sm truncate group-hover:text-gold transition-colors">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.parcels.length} parcel{p.parcels.length !== 1 ? 's' : ''} in your district</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Existing parcels table */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-navy-dark">Parcels in Your District</h2>
      </div>

      {totalParcels === 0 ? (
        <Card className="p-10 text-center text-slate-500">
          No land parcels recorded in your district yet.
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="gov-table-header hover:bg-navy-dark">
                <TableHead className="text-white/80">Survey No.</TableHead>
                <TableHead className="text-white/80">Project</TableHead>
                <TableHead className="text-white/80">Stage</TableHead>
                <TableHead className="text-white/80">Compensation</TableHead>
                <TableHead className="text-white/80">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.flatMap((p) =>
                p.parcels.map((parcel) => (
                  <TableRow key={parcel.id}>
                    <TableCell>
                      <Link
                        href={`/parcels/${parcel.id}`}
                        className="text-gold hover:text-gold-light font-medium transition-colors"
                      >
                        {parcel.surveyNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/projects/${p.id}`} className="text-slate-600 hover:text-gold transition-colors">
                        {p.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{parcel.status.replace(/_/g, ' ')}</TableCell>
                    <TableCell className="text-sm">{parcel.compensationStatus}</TableCell>
                    <TableCell>
                      <Badge className={RISK_STYLES[parcel.riskLevel ?? 'UNASSESSED']}>
                        {parcel.riskLevel ?? 'Not assessed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </DashboardLayout>
  )
}
