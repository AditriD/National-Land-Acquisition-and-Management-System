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

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
  MEDIUM: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  HIGH: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export default async function CentralDashboard() {
  const projects = await prisma.project.findMany({
    include: { parcels: true },
    orderBy: { createdAt: 'desc' },
  })

  const totalProjects = projects.length
  const totalParcels = projects.reduce((sum, p) => sum + p.parcels.length, 0)
  const highRiskCount = projects.reduce(
    (sum, p) => sum + p.parcels.filter((parcel) => parcel.riskLevel === 'HIGH').length,
    0
  )
  const disputedCount = projects.reduce(
    (sum, p) => sum + p.parcels.filter((parcel) => parcel.hasDispute).length,
    0
  )

  // Group by state for a quick breakdown
  const byState = projects.reduce((acc, p) => {
    acc[p.state] = (acc[p.state] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <DashboardLayout title="Central Dashboard — National View" role="CENTRAL">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="text-2xl font-semibold mt-1">{totalProjects}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500">Total Parcels</p>
          <p className="text-2xl font-semibold mt-1">{totalParcels}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500">High Risk Parcels</p>
          <p className="text-2xl font-semibold mt-1 text-red-600">{highRiskCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500">Disputed Parcels</p>
          <p className="text-2xl font-semibold mt-1 text-amber-600">{disputedCount}</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-3">Projects by State</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(byState).map(([state, count]) => (
            <Badge key={state} variant="outline" className="text-sm px-3 py-1">
              {state}: {count}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">All Projects</h2>
        <Link href="/projects/new" className="text-sm text-blue-600 hover:underline font-medium">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="p-10 text-center text-slate-500">No projects yet.</Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Parcels</TableHead>
                <TableHead>Highest Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => {
                const risks = p.parcels.map((parcel) => parcel.riskLevel)
                const highestRisk = risks.includes('HIGH')
                  ? 'HIGH'
                  : risks.includes('MEDIUM')
                  ? 'MEDIUM'
                  : 'LOW'
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link href={`/projects/${p.id}`} className="text-blue-600 hover:underline">
                        {p.name}
                      </Link>
                    </TableCell>
                    <TableCell>{p.state}</TableCell>
                    <TableCell>{p.sector}</TableCell>
                    <TableCell>{p.implementingAgency}</TableCell>
                    <TableCell>{p.parcels.length}</TableCell>
                    <TableCell>
                      <Badge className={RISK_STYLES[highestRisk]}>{highestRisk}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </DashboardLayout>
  )
}