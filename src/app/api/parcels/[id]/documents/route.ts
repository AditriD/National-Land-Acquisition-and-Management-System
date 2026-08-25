import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role, district: userDistrict, id: userId } = session.user

  if (role !== 'AGENCY' && role !== 'DISTRICT' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'You are not authorized to upload documents' }, { status: 403 })
  }

  const parcel = await prisma.landParcel.findUnique({ where: { id: params.id } })
  if (!parcel) return NextResponse.json({ error: 'Parcel not found' }, { status: 404 })

  if (role === 'DISTRICT' && parcel.district !== userDistrict) {
    return NextResponse.json({ error: 'Not authorized for this parcel' }, { status: 403 })
  }

  const body = await req.json()
  const { docType, fileUrl } = body

  if (!docType || !fileUrl) {
    return NextResponse.json({ error: 'docType and fileUrl are required' }, { status: 400 })
  }

  // auto-increment version if a document of the same type already exists for this parcel
  const existingCount = await prisma.documentRecord.count({
    where: { parcelId: params.id, docType },
  })

  const doc = await prisma.documentRecord.create({
    data: {
      parcelId: params.id,
      docType,
      fileUrl,
      version: existingCount + 1,
      uploadedById: userId,
    },
  })

  return NextResponse.json(doc)
}