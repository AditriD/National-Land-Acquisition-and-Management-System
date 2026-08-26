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

  // Projects that have at least one parcel in this district
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
        <h1 className="text-2xl font-semibold">District Overview</h1>
        <ViewStatsButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <p className="text-sm text-slate-500">Projects Active Here</p>
          <p className="text-2xl font-semibold mt-1">{projects.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500">Parcels in {district ?? 'District'}</p>
          <p className="text-2xl font-semibold mt-1">{totalParcels}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500">High Risk Parcels</p>
          <p className="text-2xl font-semibold mt-1 text-red-600">{highRiskCount}</p>
        </Card>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Parcel Map</h2>
        <ParcelMap parcels={parcels} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Parcels in Your District</h2>
        <Link href="/projects/new" className="text-sm text-blue-600 hover:underline font-medium">
          + New Project
        </Link>
      </div>

      {totalParcels === 0 ? (
        <Card className="p-10 text-center text-slate-500">
          No land parcels recorded in your district yet.
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Survey No.</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Compensation</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.flatMap((p) =>
                p.parcels.map((parcel) => (
                  <TableRow key={parcel.id}>
                    <TableCell>
                      <Link
                        href={`/parcels/${parcel.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {parcel.surveyNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
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