import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role, district: userDistrict } = session.user

  if (role !== 'AGENCY' && role !== 'DISTRICT' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'You are not authorized to add affected families' }, { status: 403 })
  }

  const parcel = await prisma.landParcel.findUnique({ where: { id: params.id } })
  if (!parcel) return NextResponse.json({ error: 'Parcel not found' }, { status: 404 })

  if (role === 'DISTRICT' && parcel.district !== userDistrict) {
    return NextResponse.json({ error: 'Not authorized for this parcel' }, { status: 403 })
  }

  const body = await req.json()
  const { name, rrStatus, compensationStatus } = body

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const VALID_RR = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
  const VALID_COMP = ['PENDING', 'PARTIAL', 'PAID']

  if (rrStatus && !VALID_RR.includes(rrStatus)) {
    return NextResponse.json({ error: 'Invalid rrStatus' }, { status: 400 })
  }
  if (compensationStatus && !VALID_COMP.includes(compensationStatus)) {
    return NextResponse.json({ error: 'Invalid compensationStatus' }, { status: 400 })
  }

  const family = await prisma.affectedFamily.create({
    data: {
      parcelId: params.id,
      name,
      rrStatus: rrStatus || 'PENDING',
      compensationStatus: compensationStatus || 'PENDING',
    },
  })

  return NextResponse.json(family)
}