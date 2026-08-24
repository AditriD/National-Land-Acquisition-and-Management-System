import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateRiskLevel } from '@/lib/risk'
import { Stage } from '@prisma/client'

const STAGE_ORDER: Stage[] = [
  'PROPOSAL_SUBMITTED',
  'UNDER_SCRUTINY',
  'NOTIFICATION_ISSUED',
  'AWARD_DECLARED',
  'COMPENSATION_DISBURSED',
  'POSSESSION_TAKEN',
  'RR_COMPLETED',
]

const CAN_ADVANCE: string[] = ['DISTRICT', 'STATE', 'CENTRAL', 'ADMIN']   // <-- ADD THIS LINE

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!CAN_ADVANCE.includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden — read-only role' }, { status: 403 })
  }

  const { notes } = await req.json()

  const parcel = await prisma.landParcel.findUnique({ where: { id } })
  if (!parcel) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const currentIndex = STAGE_ORDER.indexOf(parcel.status)
  const nextStage = STAGE_ORDER[currentIndex + 1]
  if (!nextStage) {
    return NextResponse.json({ error: 'Already at final stage' }, { status: 400 })
  }

  const awardDate = nextStage === 'AWARD_DECLARED' ? new Date() : parcel.awardDate

  const risk = calculateRiskLevel({
    hasDispute: parcel.hasDispute,
    awardDate,
    compensationStatus: parcel.compensationStatus,
  })

  const [updatedParcel] = await prisma.$transaction([
    prisma.landParcel.update({
      where: { id },
      data: {
        status: nextStage,
        enteredStageAt: new Date(),
        ...(nextStage === 'AWARD_DECLARED' ? { awardDate: new Date() } : {}),
        riskLevel: risk.riskLevel,
        riskReason: risk.riskReason,
        riskUpdatedAt: new Date(),
      },
    }),
    prisma.statusHistory.create({
      data: {
        parcelId: id,
        fromStage: parcel.status,
        toStage: nextStage,
        changedById: session.user.id,
        notes,
      },
    }),
  ])

  return NextResponse.json(updatedParcel)
}