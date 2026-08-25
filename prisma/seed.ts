import { PrismaClient, Role, VerificationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedProjectsAndLandParcels } from './seed-data/projects-and-parcels'
import { seedRequiredDocuments } from './seed-data/required-documents'
import { seedStatusHistory } from './seed-data/status-history'
import { seedPlaceholderRisk } from './seed-data/risk-placeholder'
import { seedDocumentsAndFamilies } from './seed-data/documents-and-families'

const prisma = new PrismaClient()


async function main() {
  await prisma.project.deleteMany()
  await prisma.requiredDocument.deleteMany()
  await prisma.otpVerification.deleteMany()
  await prisma.user.deleteMany()
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1 Admin — seeded directly, approved by default
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@landacq.gov.in',
      password: hashedPassword,
      role: Role.ADMIN,
      verificationStatus: VerificationStatus.APPROVED,
    },
  })

  // Central user — no state
  await prisma.user.create({
    data: {
      name: 'Central Ministry Officer',
      email: 'central@landacq.gov.in',
      password: hashedPassword,
      role: Role.CENTRAL,
      verificationStatus: VerificationStatus.APPROVED,
    },
  })

  // State users — one per chosen state
  const states = ['Telangana', 'Maharashtra', 'Assam']
  for (const state of states) {
    await prisma.user.create({
      data: {
        name: `${state} State Officer`,
        email: `state.${state.toLowerCase()}@landacq.gov.in`,
        password: hashedPassword,
        role: Role.STATE,
        state,
        verificationStatus: VerificationStatus.APPROVED,
      },
    })
  }

  // District users — one per state (pick one real district per state)
  const districts = [
    { state: 'Telangana', district: 'Rangareddy' },
    { state: 'Maharashtra', district: 'Nagpur' },
    { state: 'Assam', district: 'Kamrup' },
  ]
  for (const { state, district } of districts) {
    await prisma.user.create({
      data: {
        name: `${district} District Officer`,
        email: `district.${district.toLowerCase()}@landacq.gov.in`,
        password: hashedPassword,
        role: Role.DISTRICT,
        state,
        district,
        verificationStatus: VerificationStatus.APPROVED,
      },
    })
  }

  // Agency users — one per sector
  const agencies = ['NHAI', 'Indian Railways', 'State Irrigation Department']
  for (const agency of agencies) {
    await prisma.user.create({
      data: {
        name: `${agency} Representative`,
        email: `agency.${agency.toLowerCase().replace(/\s+/g, '')}@landacq.gov.in`,
        password: hashedPassword,
        role: Role.AGENCY,
        verificationStatus: VerificationStatus.APPROVED,
      },
    })
  }

  console.log('✅ Users seeded successfully')
  const { landParcels } = await seedProjectsAndLandParcels(prisma)
  console.log('✅ Projects and LandParcels seeded successfully')

  await seedRequiredDocuments(prisma)
  console.log('✅ Required documents seeded successfully')

  await seedStatusHistory(prisma, landParcels)
  console.log('✅ Status history seeded successfully')

  await seedPlaceholderRisk(prisma, landParcels)
  console.log('✅ Placeholder risk values seeded successfully')

  await seedDocumentsAndFamilies(prisma, landParcels)
  console.log('✅ Documents and families seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })