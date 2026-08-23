-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CENTRAL', 'STATE', 'DISTRICT', 'AGENCY', 'CITIZEN');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('PROPOSAL_SUBMITTED', 'UNDER_SCRUTINY', 'NOTIFICATION_ISSUED', 'AWARD_DECLARED', 'COMPENSATION_DISBURSED', 'POSSESSION_TAKEN', 'RR_COMPLETED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RRStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CompensationStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "state" TEXT,
    "district" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationDocUrl" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ministry" TEXT NOT NULL,
    "implementingAgency" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetCompletion" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandParcel" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "district" TEXT,
    "surveyNumber" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "areaHectares" DOUBLE PRECISION NOT NULL,
    "status" "Stage" NOT NULL DEFAULT 'PROPOSAL_SUBMITTED',
    "enteredStageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardDate" TIMESTAMP(3),
    "compensationAmount" DOUBLE PRECISION,
    "compensationPaid" DOUBLE PRECISION,
    "compensationStatus" "CompensationStatus" NOT NULL DEFAULT 'PENDING',
    "hasDispute" BOOLEAN NOT NULL DEFAULT false,
    "disputeNotes" TEXT,
    "ownerName" TEXT,
    "ownerPhone" TEXT,
    "riskLevel" "RiskLevel",
    "riskReason" TEXT,
    "riskUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "LandParcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRecord" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffectedFamily" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rrStatus" "RRStatus" NOT NULL DEFAULT 'PENDING',
    "compensationStatus" "CompensationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "AffectedFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "fromStage" "Stage",
    "toStage" "Stage" NOT NULL,
    "changedById" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequiredDocument" (
    "id" TEXT NOT NULL,
    "stage" "Stage" NOT NULL,
    "docType" TEXT NOT NULL,

    CONSTRAINT "RequiredDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_verificationStatus_idx" ON "User"("verificationStatus");

-- CreateIndex
CREATE INDEX "Project_state_idx" ON "Project"("state");

-- CreateIndex
CREATE INDEX "Project_sector_idx" ON "Project"("sector");

-- CreateIndex
CREATE INDEX "Project_implementingAgency_idx" ON "Project"("implementingAgency");

-- CreateIndex
CREATE INDEX "LandParcel_status_idx" ON "LandParcel"("status");

-- CreateIndex
CREATE INDEX "LandParcel_projectId_idx" ON "LandParcel"("projectId");

-- CreateIndex
CREATE INDEX "LandParcel_district_idx" ON "LandParcel"("district");

-- CreateIndex
CREATE INDEX "LandParcel_surveyNumber_ownerPhone_idx" ON "LandParcel"("surveyNumber", "ownerPhone");

-- CreateIndex
CREATE UNIQUE INDEX "LandParcel_projectId_surveyNumber_key" ON "LandParcel"("projectId", "surveyNumber");

-- CreateIndex
CREATE INDEX "DocumentRecord_parcelId_idx" ON "DocumentRecord"("parcelId");

-- CreateIndex
CREATE INDEX "AffectedFamily_parcelId_idx" ON "AffectedFamily"("parcelId");

-- CreateIndex
CREATE INDEX "StatusHistory_parcelId_idx" ON "StatusHistory"("parcelId");

-- CreateIndex
CREATE INDEX "StatusHistory_toStage_idx" ON "StatusHistory"("toStage");

-- CreateIndex
CREATE UNIQUE INDEX "RequiredDocument_stage_docType_key" ON "RequiredDocument"("stage", "docType");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandParcel" ADD CONSTRAINT "LandParcel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRecord" ADD CONSTRAINT "DocumentRecord_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "LandParcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRecord" ADD CONSTRAINT "DocumentRecord_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectedFamily" ADD CONSTRAINT "AffectedFamily_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "LandParcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "LandParcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
