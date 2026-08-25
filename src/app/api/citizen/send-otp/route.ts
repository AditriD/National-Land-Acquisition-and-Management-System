import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { surveyNumber, phone } = await req.json()

  if (!surveyNumber || !phone) {
    return NextResponse.json({ error: 'Survey number and phone required' }, { status: 400 })
  }

  const parcel = await prisma.landParcel.findFirst({
    where: { surveyNumber, ownerPhone: phone },
  })

  if (!parcel) {
    return NextResponse.json(
      { error: 'No parcel found matching that survey number and phone number' },
      { status: 404 }
    )
  }

  // Simulated OTP — no real SMS gateway for the prototype.
  // In production this would call an SMS provider (e.g. Twilio, MSG91).
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  await prisma.otpVerification.deleteMany({ where: { email: `citizen:${phone}` } })
  await prisma.otpVerification.create({
    data: {
      email: `citizen:${phone}`, // reusing the same model, keyed by phone instead of email
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  })

  console.log(`[SIMULATED SMS] OTP for ${phone}: ${otp}`)

  return NextResponse.json({ success: true, simulatedOtp: otp })
}