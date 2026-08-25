/**
 * prisma/seed-data/risk-placeholder.ts
 *
 * ⚠️ PLACEHOLDER — NOT THE REAL ML RISK MODEL ⚠️
 *
 * Fills riskLevel/riskReason/riskUpdatedAt for LandParcels that don't
 * already have them set (i.e. skips the parcels your original research
 * explicitly flagged as HIGH risk — those stay untouched).
 *
 * This is a simple rule-based heuristic derived from fields that are
 * already real (status, enteredStageAt, hasDispute, compensationPaid)
 * — it is NOT a substitute for the actual ML risk model referenced in
 * schema.prisma. When that model exists, it should overwrite these
 * values. Swap/delete this file at that point.
 *
 * Usage from your main prisma/seed.ts (after landParcels exist):
 *
 *   import { seedPlaceholderRisk } from "./seed-data/risk-placeholder";
 *   await seedPlaceholderRisk(prisma, landParcels);
 */

import { PrismaClient, Stage, RiskLevel } from '@prisma/client'

interface LandParcelSeedData {
  id: string
  status: Stage
  hasDispute: boolean
  compensationPaid: number | null
  enteredStageAt: Date
  riskLevel: RiskLevel | null
}

const daysSince = (date: Date) =>
  Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000))

export async function seedPlaceholderRisk(
  prisma: PrismaClient,
  landParcels: LandParcelSeedData[]
) {
  let updatedCount = 0

  for (const parcel of landParcels) {
    // Don't touch parcels that already have a riskLevel set from the
    // original research (the explicit HIGH-risk cases).
    if (parcel.riskLevel !== null) continue

    const daysInStage = daysSince(parcel.enteredStageAt)
    let riskLevel: RiskLevel = RiskLevel.LOW
    let riskReason = 'Early-stage or on-track parcel — no red flags in current data.'

    if (parcel.hasDispute && (!parcel.compensationPaid || parcel.compensationPaid === 0)) {
      riskLevel = RiskLevel.HIGH
      riskReason = 'Active dispute with zero compensation disbursed — placeholder flag pending ML assessment.'
    } else if (parcel.hasDispute) {
      riskLevel = RiskLevel.MEDIUM
      riskReason = 'Active dispute recorded — placeholder flag pending ML assessment.'
    } else if (parcel.status === Stage.AWARD_DECLARED && daysInStage >= 365) {
      riskLevel = RiskLevel.HIGH
      riskReason = `Award declared ${daysInStage}+ days ago — placeholder Section 24(2) lapse-risk flag pending ML assessment.`
    } else if (parcel.status === Stage.AWARD_DECLARED && daysInStage >= 120) {
      riskLevel = RiskLevel.MEDIUM
      riskReason = `Award declared ${daysInStage}+ days ago with no resolution yet — placeholder flag pending ML assessment.`
    } else if (
      (parcel.status === Stage.POSSESSION_TAKEN || parcel.status === Stage.COMPENSATION_DISBURSED) &&
      daysInStage >= 500
    ) {
      riskLevel = RiskLevel.MEDIUM
      riskReason = `Parcel has sat at this stage ${daysInStage}+ days without closure — placeholder flag pending ML assessment.`
    }

    await prisma.landParcel.update({
      where: { id: parcel.id },
      data: {
        riskLevel,
        riskReason,
        riskUpdatedAt: new Date(),
      },
    })
    updatedCount++
  }

  console.log(`Seeded placeholder risk values for ${updatedCount} land parcels.`)
  return { updatedCount }
}