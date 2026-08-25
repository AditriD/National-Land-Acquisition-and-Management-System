import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { surveyNumber, phone, otp } = await req.json()

  if (!surveyNumber || !phone || !otp) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const record = await prisma.otpVerification.findFirst({
    where: { email: `citizen:${phone}`, otp },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }
  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Code expired, please try again' }, { status: 400 })
  }

  const parcel = await prisma.landParcel.findFirst({
    where: { surveyNumber, ownerPhone: phone },
    include: { project: { select: { name: true } } },
  })

  if (!parcel) {
    return NextResponse.json({ error: 'Parcel not found' }, { status: 404 })
  }

  await prisma.otpVerification.deleteMany({ where: { email: `citizen:${phone}` } })

  return NextResponse.json({
    parcel: {
      surveyNumber: parcel.surveyNumber,
      status: parcel.status,
      compensationAmount: parcel.compensationAmount,
      compensationStatus: parcel.compensationStatus,
      riskLevel: parcel.riskLevel,
      projectName: parcel.project.name,
    },
  })
}