import { prisma } from '../src/lib/prisma'
import { calculateRiskLevel } from '../src/lib/risk'

async function run() {
  const parcels = await prisma.landParcel.findMany({
    include: { documents: true }
  })
  const requiredDocs = await prisma.requiredDocument.findMany()

  for (const parcel of parcels) {
    const daysInStage = Math.floor((Date.now() - parcel.enteredStageAt.getTime()) / 86400000)
    const requiredForStage = requiredDocs.filter(d => d.stage === parcel.status)
    const uploadedTypes = new Set(parcel.documents.map(d => d.docType))
    const missingDocCount = requiredForStage.filter(rd => !uploadedTypes.has(rd.docType)).length

    const { riskLevel, riskReason } = calculateRiskLevel({
      hasDispute: parcel.hasDispute,
      awardDate: parcel.awardDate,
      compensationStatus: parcel.compensationStatus,
      daysInStage,
      missingDocCount,
    })

    await prisma.landParcel.update({
      where: { id: parcel.id },
      data: { riskLevel, riskReason, riskUpdatedAt: new Date() },
    })
  }
  console.log(`Scored ${parcels.length} parcels`)
}

run().then(() => process.exit(0))