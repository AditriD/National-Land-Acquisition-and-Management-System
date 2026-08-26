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
import { Building2, MapPin, ShieldAlert, Users, Plus } from 'lucide-react'

const parcels = await getScopedParcels()

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
  MEDIUM: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  HIGH: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export default async function StateDashboard() {
  const session = await getServerSession(authOptions)
  const state = session?.user.state

  const projects = await prisma.project.findMany({
    where: state ? { state } : undefined,
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

  const canCreate = session && (session.user.role === 'CENTRAL' || session.user.role === 'STATE')

  return (
    <DashboardLayout title={`State Dashboard — ${state ?? 'N/A'}`} role="STATE">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-dark">State Overview</h1>
        <ViewStatsButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="gov-stat-card group hover:border-gold hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-3 group-hover:bg-navy/20 transition-colors">
            <Building2 className="w-5 h-5 text-navy" />
          </div>
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="text-3xl font-bold text-navy-dark mt-1">{totalProjects}</p>
        </Card>
        <Card className="gov-stat-card group hover:border-gold hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center mb-3 group-hover:bg-gold/25 transition-colors">
            <MapPin className="w-5 h-5 text-gold" />
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
        <Card className="gov-stat-card group hover:border-amber-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-sm text-slate-500">Disputed Parcels</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{disputedCount}</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold text-navy-dark mb-4">Parcel Map</h2>
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <ParcelMap parcels={parcels} />
        </div>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-navy-dark">Projects</h2>
        {canCreate && (
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gold text-navy-dark px-4 py-2 rounded-md hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <Card className="p-10 text-center text-slate-500">
          No projects yet for this state.
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="gov-table-header hover:bg-navy-dark">
                <TableHead className="text-white/80">Name</TableHead>
                <TableHead className="text-white/80">Sector</TableHead>
                <TableHead className="text-white/80">Agency</TableHead>
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
                      <Link href={`/projects/${p.id}`} className="text-gold hover:text-gold-light font-medium transition-colors">
                        {p.name}
                      </Link>
                    </TableCell>
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
