import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateRiskLevel } from '@/lib/risk'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role, district: userDistrict } = session.user

  if (role !== 'AGENCY' && role !== 'DISTRICT' && role !== 'STATE') {
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

    const { riskLevel, riskReason } = calculateRiskLevel({
      hasDispute: false,
      awardDate: null,
      compensationStatus: 'PENDING',
      daysInStage: 0,
      missingDocCount: 0,
    })

    const updated = await prisma.landParcel.update({
      where: { id: parcel.id },
      data: { riskLevel, riskReason, riskUpdatedAt: new Date() },
    })

    return NextResponse.json(updated)

  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'A parcel with this survey number already exists for this project' },
        { status: 400 }
      )
    }
    throw err
  }
}