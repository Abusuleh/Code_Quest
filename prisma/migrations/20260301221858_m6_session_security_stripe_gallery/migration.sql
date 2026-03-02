-- AlterEnum
ALTER TYPE "SubscriptionPlan" ADD VALUE 'SPARK';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "lessonId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
