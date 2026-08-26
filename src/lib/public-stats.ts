import { prisma } from '@/lib/prisma'

export async function getPublicHomeStats() {
  const [
    totalProjects,
    totalParcels,
    highRisk,
    disputed,
    stageCountsRaw,
    compensationPending,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.landParcel.count(),
    prisma.landParcel.count({ where: { riskLevel: 'HIGH' } }),
    prisma.landParcel.count({ where: { hasDispute: true } }),
    prisma.landParcel.groupBy({ by: ['status'], _count: true }),
    prisma.landParcel.count({
      where: { compensationStatus: { in: ['PENDING', 'PARTIAL'] } },
    }),
  ])

  const stageMap = Object.fromEntries(
    stageCountsRaw.map((s) => [s.status, s._count])
  ) as Record<string, number>

  const underScrutiny = stageMap['UNDER_SCRUTINY'] ?? 0
  const notificationIssued = stageMap['NOTIFICATION_ISSUED'] ?? 0
  const possessionTaken =
    (stageMap['POSSESSION_TAKEN'] ?? 0) + (stageMap['RR_COMPLETED'] ?? 0)
  const pending = stageMap['PROPOSAL_SUBMITTED'] ?? 0
  const completed = possessionTaken
  const inProgress = Math.max(totalParcels - completed - pending, 0)
  const overallProgressPct =
    totalParcels > 0 ? Math.round((completed / totalParcels) * 100) : 0

  return {
    totalProjects,
    totalParcels,
    highRisk,
    disputed,
    liveStatus: {
      underScrutiny,
      notificationIssued,
      compensationPending,
      possessionTaken,
    },
    progress: { completed, inProgress, pending, overallProgressPct },
  }
}