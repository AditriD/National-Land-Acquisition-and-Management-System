import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getScopedParcels() {
  const session = await getServerSession(authOptions)
  if (!session) return []

  const { role, state, district, agencyName } = session.user

  let where = {}

  if (role === 'CENTRAL' || role === 'ADMIN') {
    where = {}
  } else if (role === 'STATE') {
    where = { project: { state } }
  } else if (role === 'DISTRICT') {
    // district lives directly on LandParcel, state still comes via the related Project
    where = { district, project: { state } }
  } else if (role === 'AGENCY') {
    where = { project: { implementingAgency: agencyName } }
  }

  const parcels = await prisma.landParcel.findMany({
    where,
    select: {
      id: true,
      surveyNumber: true,
      latitude: true,
      longitude: true,
      status: true,
      riskLevel: true,
    },
  })

  return parcels
}