/**
 * prisma/seed-data/required-documents.ts
 *
 * Reference table: which docType is required to be considered
 * "complete" at each Stage. Used by the ML risk model to compute
 * missing_document_count (see schema.prisma comment on RequiredDocument).
 *
 * IMPORTANT: docType strings here must exactly match the docType
 * strings used in documents-and-families.ts (documentTypes array):
 *   'Ownership Proof', 'Survey Settlement', 'Notification Copy'
 */

import { PrismaClient, Stage } from '@prisma/client'

interface RequiredDocumentSeedInput {
  stage: Stage;
  docType: string;
}

const requiredDocumentsSeed: RequiredDocumentSeedInput[] = [
  { stage: Stage.UNDER_SCRUTINY, docType: 'Ownership Proof' },
  { stage: Stage.NOTIFICATION_ISSUED, docType: 'Survey Settlement' },
  { stage: Stage.AWARD_DECLARED, docType: 'Notification Copy' },
  { stage: Stage.COMPENSATION_DISBURSED, docType: 'Ownership Proof' },
  { stage: Stage.POSSESSION_TAKEN, docType: 'Survey Settlement' },
  { stage: Stage.RR_COMPLETED, docType: 'Notification Copy' },
];

export async function seedRequiredDocuments(prisma: PrismaClient) {
  const requiredDocumentIds: string[] = []

  for (const rd of requiredDocumentsSeed) {
    const created = await prisma.requiredDocument.create({
      data: {
        stage: rd.stage,
        docType: rd.docType,
      },
    });
    requiredDocumentIds.push(created.id);
  }

  console.log(`Seeded ${requiredDocumentsSeed.length} required documents.`)
  return { requiredDocumentIds }
}