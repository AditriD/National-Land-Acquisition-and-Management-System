//check-status
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      password: true,
      verificationStatus: true,
      rejectionReason: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  if (user.verificationStatus === 'PENDING') {
    return NextResponse.json(
      { error: 'Your account is still under verification. Please wait for admin approval.' },
      { status: 403 }
    )
  }
  if (user.verificationStatus === 'REJECTED') {
    return NextResponse.json(
      {
        error: user.rejectionReason
          ? `Your account was rejected: ${user.rejectionReason}`
          : 'Your account was rejected. Please contact an admin.',
      },
      { status: 403 }
    )
  }

  return NextResponse.json({ success: true })
}