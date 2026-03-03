/*
  Warnings:

  - Added the required column `createdById` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "XPEventType" ADD VALUE 'GUILD_BONUS';
ALTER TYPE "XPEventType" ADD VALUE 'FORGE_TRIAL_WIN';
ALTER TYPE "XPEventType" ADD VALUE 'BUILDER_BADGE';

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxMembers" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "trialWins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ForgeTrial" (
    "id" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "challenge" JSONB NOT NULL,
    "phase" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForgeTrial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForgeTrialEntry" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForgeTrialEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForgeTrial_weekStart_phase_key" ON "ForgeTrial"("weekStart", "phase");

-- CreateIndex
CREATE INDEX "ForgeTrialEntry_trialId_score_idx" ON "ForgeTrialEntry"("trialId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "ForgeTrialEntry_trialId_childId_key" ON "ForgeTrialEntry"("trialId", "childId");

-- AddForeignKey
ALTER TABLE "ForgeTrialEntry" ADD CONSTRAINT "ForgeTrialEntry_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ForgeTrial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForgeTrialEntry" ADD CONSTRAINT "ForgeTrialEntry_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
