import { CompensationStatus } from '@prisma/client'

type RiskInput = {
  hasDispute: boolean
  awardDate: Date | null
  compensationStatus: CompensationStatus
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

    // Approaching the deadline but not there yet — flag as MEDIUM instead of silently LOW
    const daysRemaining = AWARD_DEADLINE_DAYS - daysSinceAward
    if (daysRemaining <= 60) {
      return {
        riskLevel: 'MEDIUM',
        riskReason: `Compensation due in ${daysRemaining} days (approaching Section 24(2) deadline)`,
      }
    }

    // Partial payment on an otherwise-fine timeline is worth a soft flag too
    if (parcel.compensationStatus === 'PARTIAL') {
      return { riskLevel: 'MEDIUM', riskReason: 'Compensation only partially disbursed' }
    }
  }

  return { riskLevel: 'LOW', riskReason: 'No hard-rule risk factors detected' }
}