import { CompensationStatus } from '@prisma/client'

type RiskInput = {
  hasDispute: boolean
  awardDate: Date | null
  compensationStatus: CompensationStatus
  daysInStage: number
  missingDocCount: number
}

type RiskResult = {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  riskReason: string
}

const AWARD_DEADLINE_DAYS = 365 // Section 24(2) lapse window

export function calculateRiskLevel(parcel: RiskInput): RiskResult {
  // Hard rule 1: active dispute always wins — overrides everything else
  if (parcel.hasDispute) {
    return { riskLevel: 'HIGH', riskReason: 'Active legal dispute on this parcel' }
  }

  // Hard rule 2: compensation overdue past the statutory deadline
  if (parcel.awardDate && parcel.compensationStatus !== 'PAID') {
    const daysSinceAward = Math.floor(
      (Date.now() - new Date(parcel.awardDate).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceAward > AWARD_DEADLINE_DAYS) {
      return {
        riskLevel: 'HIGH',
        riskReason: `Compensation overdue ${daysSinceAward} days past award (Section 24(2) lapse risk)`,
      }
    }

    const daysRemaining = AWARD_DEADLINE_DAYS - daysSinceAward
    if (daysRemaining <= 60) {
      return {
        riskLevel: 'MEDIUM',
        riskReason: `Compensation due in ${daysRemaining} days (approaching Section 24(2) deadline)`,
      }
    }

    if (parcel.compensationStatus === 'PARTIAL') {
      return { riskLevel: 'MEDIUM', riskReason: 'Compensation only partially disbursed' }
    }
  }

  // Soft rule: stage stagnation + missing documents
  if (parcel.daysInStage > 30 && parcel.missingDocCount > 0) {
    return {
      riskLevel: 'HIGH',
      riskReason: `Stuck ${parcel.daysInStage} days in stage with ${parcel.missingDocCount} missing document(s)`,
    }
  }
  if (parcel.daysInStage > 30 || parcel.missingDocCount > 0) {
    return {
      riskLevel: 'MEDIUM',
      riskReason: parcel.daysInStage > 30
        ? `${parcel.daysInStage} days in current stage`
        : `${parcel.missingDocCount} missing document(s)`,
    }
  }

  return { riskLevel: 'LOW', riskReason: 'No risk factors detected' }
}