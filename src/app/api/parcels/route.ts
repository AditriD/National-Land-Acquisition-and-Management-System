import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role, district: userDistrict } = session.user

  if (role !== 'AGENCY' && role !== 'DISTRICT' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'You are not authorized to create parcels' }, { status: 403 })
  }

  const body = await req.json()
  const {
    projectId, district, surveyNumber, latitude, longitude, areaHectares,
    ownerName, ownerPhone,
  } = body

  if (!projectId || !surveyNumber || latitude == null || longitude == null || areaHectares == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // DISTRICT users can only create parcels in their own district
  if (role === 'DISTRICT') {
    if (!district || district !== userDistrict) {
      return NextResponse.json(
        { error: `As a District user, you can only create parcels for ${userDistrict}` },
        { status: 403 }
      )
    }
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  try {
    const parcel = await prisma.landParcel.create({
      data: {
        projectId,
        district: district || null,
        surveyNumber,
        latitude,
        longitude,
        areaHectares,
        ownerName: ownerName || null,
        ownerPhone: ownerPhone || null,
      },
    })
    return NextResponse.json(parcel)
  } catch (err: any) {
    // unique constraint on [projectId, surveyNumber]
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'A parcel with this survey number already exists for this project' },
        { status: 400 }
      )
    }
    throw err
  }
}