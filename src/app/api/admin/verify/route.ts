import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { userId, decision, rejectionReason } = await req.json()

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      verificationStatus: decision,
      verifiedById: session.user.id,
      verifiedAt: new Date(),
      rejectionReason: decision === 'REJECTED' ? rejectionReason : null,
    },
  })

  return NextResponse.json(updated)
}