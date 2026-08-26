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
import { Building2, MapPin, ShieldAlert } from 'lucide-react'

const parcels = await getScopedParcels()

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
  MEDIUM: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  HIGH: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export default async function AgencyDashboard() {
  const session = await getServerSession(authOptions)
  const agencyName = session?.user.agencyName

  const projects = await prisma.project.findMany({
    where: agencyName ? { implementingAgency: agencyName } : undefined,
    include: { parcels: true },
    orderBy: { createdAt: 'desc' },
  })

  const totalProjects = projects.length
  const totalParcels = projects.reduce((sum, p) => sum + p.parcels.length, 0)
  const highRiskCount = projects.reduce(
    (sum, p) => sum + p.parcels.filter((parcel) => parcel.riskLevel === 'HIGH').length,
    0
  )

  return (
    <DashboardLayout title={`Agency Dashboard — ${agencyName ?? 'N/A'}`} role="AGENCY">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-dark">Agency Overview</h1>
        <ViewStatsButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="gov-stat-card group hover:border-navy/30 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-3 group-hover:bg-navy/20 transition-colors">
            <Building2 className="w-5 h-5 text-navy" />
          </div>
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="text-3xl font-bold text-navy-dark mt-1">{totalProjects}</p>
        </Card>
        <Card className="gov-stat-card group hover:border-navy/30 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-3 group-hover:bg-navy/20 transition-colors">
            <MapPin className="w-5 h-5 text-navy" />
          </div>
          <p className="text-sm text-slate-500">Total Parcels</p>
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-navy-dark">Your Projects</h2>
      </div>

      {projects.length === 0 ? (
        <Card className="p-10 text-center text-slate-500">
          No projects assigned to your agency yet.
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="gov-table-header hover:bg-navy-dark">
                <TableHead className="text-white/80">Name</TableHead>
                <TableHead className="text-white/80">State</TableHead>
                <TableHead className="text-white/80">Sector</TableHead>
                <TableHead className="text-white/80">Parcels</TableHead>
                <TableHead className="text-white/80">Highest Risk</TableHead>
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
                      <Link href={`/projects/${p.id}`} className="text-navy-dark hover:text-navy font-semibold transition-colors">
                        {p.name}
                      </Link>
                    </TableCell>
                    <TableCell>{p.state}</TableCell>
                    <TableCell>{p.sector}</TableCell>
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
