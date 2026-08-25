import {
  PrismaClient,
  Stage,
  RRStatus,
  CompensationStatus,
} from '@prisma/client'

type LandParcelSeedData = {
  id: string
  status: Stage
  hasDispute: boolean
}

export async function seedDocumentsAndFamilies(
  prisma: PrismaClient,
  landParcels: LandParcelSeedData[]
) {
  // Get a user because DocumentRecord requires uploadedById
  const admin = await prisma.user.findFirst({
    where: {
      role: 'ADMIN',
    },
  })

  if (!admin) {
    throw new Error('Admin user not found. Seed users first.')
  }

  const documentTypes = [
    'Ownership Proof',
    'Survey Settlement',
    'Notification Copy',
  ]

  for (let index = 0; index < landParcels.length; index++) {
    const parcel = landParcels[index]

    // ==========================================
    // DOCUMENT RECORDS
    // ==========================================

    let documentsToCreate = 0

    // Early stages: few documents
    if (
      parcel.status === Stage.PROPOSAL_SUBMITTED ||
      parcel.status === Stage.UNDER_SCRUTINY
    ) {
      documentsToCreate = index % 2 === 0 ? 1 : 0
    }

    // Middle stages: partial documents
    if (
      parcel.status === Stage.NOTIFICATION_ISSUED ||
      parcel.status === Stage.AWARD_DECLARED
    ) {
      documentsToCreate = 2
    }

    // Later stages: mostly complete
    if (
      parcel.status === Stage.COMPENSATION_DISBURSED ||
      parcel.status === Stage.POSSESSION_TAKEN ||
      parcel.status === Stage.RR_COMPLETED
    ) {
      documentsToCreate = 3
    }

    // Disputed parcels deliberately have fewer documents
    if (parcel.hasDispute && documentsToCreate > 0) {
      documentsToCreate = documentsToCreate - 1
    }

    for (let i = 0; i < documentsToCreate; i++) {
      const docType = documentTypes[i]

      await prisma.documentRecord.create({
        data: {
          parcelId: parcel.id,
          docType,
          fileUrl: `https://example.com/documents/${parcel.id}/${i + 1}.pdf`,
          version: 1,
          uploadedById: admin.id,
        },
      })
    }

    // ==========================================
    // AFFECTED FAMILIES
    // ==========================================

    const familyCount = (index % 5) + 1

    for (let i = 0; i < familyCount; i++) {
      let rrStatus: RRStatus = RRStatus.PENDING
      let compensationStatus: CompensationStatus =
        CompensationStatus.PENDING

      // Early stages
      if (
        parcel.status === Stage.PROPOSAL_SUBMITTED ||
        parcel.status === Stage.UNDER_SCRUTINY
      ) {
        rrStatus = RRStatus.PENDING
        compensationStatus = CompensationStatus.PENDING
      }

      // Middle stages
      else if (
        parcel.status === Stage.NOTIFICATION_ISSUED ||
        parcel.status === Stage.AWARD_DECLARED
      ) {
        rrStatus =
          i % 2 === 0 ? RRStatus.IN_PROGRESS : RRStatus.PENDING

        compensationStatus =
          i % 2 === 0
            ? CompensationStatus.PARTIAL
            : CompensationStatus.PENDING
      }

      // Late stages
      else {
        rrStatus =
          i % 3 === 0 ? RRStatus.COMPLETED : RRStatus.IN_PROGRESS

        compensationStatus =
          i % 3 === 0
            ? CompensationStatus.PAID
            : CompensationStatus.PARTIAL
      }

      // Disputes keep some families unresolved
      if (parcel.hasDispute && i === 0) {
        rrStatus = RRStatus.PENDING
        compensationStatus = CompensationStatus.PENDING
      }

      await prisma.affectedFamily.create({
        data: {
          parcelId: parcel.id,
          name: `Affected Family ${index + 1}-${i + 1}`,
          rrStatus,
          compensationStatus,
        },
      })
    }
  }

  console.log(
    `Seeded documents and families for ${landParcels.length} parcels.`
  )
}