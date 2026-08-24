import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_ROLES = ['CENTRAL', 'STATE', 'DISTRICT', 'AGENCY']

export async function POST(req: Request) {
  const { otp, form } = await req.json()
  const { email, name, password, role, state, district, verificationDocUrl } = form ?? {}

  // Re-validate required fields — never trust the client alone
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  if ((role === 'STATE' || role === 'DISTRICT') && !state) {
    return NextResponse.json({ error: 'State is required for this role' }, { status: 400 })
  }
  if (role === 'DISTRICT' && !district) {
    return NextResponse.json({ error: 'District is required for this role' }, { status: 400 })
  }
  if (!otp || typeof otp !== 'string' || otp.length !== 6) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  const record = await prisma.otpVerification.findFirst({
    where: { email, otp },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }
  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Code expired, please resend' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name, email, password: hashedPassword, role,
      state: state || null, district: district || null,
      verificationDocUrl,
      verificationStatus: 'PENDING',
    },
  })

  await prisma.otpVerification.deleteMany({ where: { email } })

  return NextResponse.json({ id: user.id })
}