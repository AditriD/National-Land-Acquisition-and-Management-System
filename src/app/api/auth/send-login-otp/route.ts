import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  if (user.verificationStatus !== 'APPROVED') {
    return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.otpVerification.deleteMany({ where: { email } })
  await prisma.otpVerification.create({ data: { email, otp, expiresAt } })

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your login verification code',
      html: `<p>Your login code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
    })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}