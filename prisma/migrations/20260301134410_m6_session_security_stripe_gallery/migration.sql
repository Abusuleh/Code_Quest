-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "activeSessionToken" TEXT,
ADD COLUMN     "deviceFingerprints" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "deviceFpUpdatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "childSeats" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "stripeNgn" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DeviceLog" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpvote" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeviceLog_childId_seenAt_idx" ON "DeviceLog"("childId", "seenAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectUpvote_projectId_userId_key" ON "ProjectUpvote"("projectId", "userId");
