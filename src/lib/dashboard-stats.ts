// src/lib/dashboard-stats.ts
import { prisma } from '@/lib/prisma'

type SessionUser = {
  role: 'ADMIN' | 'CENTRAL' | 'STATE' | 'DISTRICT' | 'AGENCY' | 'CITIZEN'
  state?: string | null
  district?: string | null
  agencyName?: string | null
  id: string
}

export async function getScopedStats(user: SessionUser) {
  // Filter at the LandParcel level (stage + risk charts)
  const parcelWhere =
    user.role === 'STATE'
      ? { project: { state: user.state ?? undefined } }
      : user.role === 'DISTRICT'
        ? { district: user.district ?? undefined }
        : user.role === 'AGENCY'
          ? { project: { implementingAgency: user.agencyName ?? undefined } }
          : {} // CENTRAL / ADMIN: no filter

  // Filter at the Project level (sector chart)
  const projectWhere =
    user.role === 'STATE'
      ? { state: user.state ?? undefined }
      : user.role === 'DISTRICT'
        ? { parcels: { some: { district: user.district ?? undefined } } }
        : user.role === 'AGENCY'
          ? { implementingAgency: user.agencyName ?? undefined }
          : {} // CENTRAL / ADMIN: no filter

  const [byStageRaw, byRiskRaw, bySectorRaw] = await Promise.all([
    prisma.landParcel.groupBy({
      by: ['status'],
      where: parcelWhere,
      _count: true,
    }),
    prisma.landParcel.groupBy({
      by: ['riskLevel'],
      where: parcelWhere,
      _count: true,
    }),
    prisma.project.groupBy({
      by: ['sector'],
      where: projectWhere,
      _count: true,
    }),
  ])

  return {
    byStage: byStageRaw.map(s => ({ name: s.status, count: s._count })),
    byRisk: byRiskRaw.map(r => ({ name: r.riskLevel ?? 'Unscored', count: r._count })),
    bySector: bySectorRaw.map(s => ({ name: s.sector, count: s._count })),
  }
}