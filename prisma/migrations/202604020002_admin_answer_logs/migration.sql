-- AlterEnum
ALTER TYPE "AdminTargetType" ADD VALUE 'ANSWER';

-- AlterTable
ALTER TABLE "Answer"
ADD COLUMN "deletedAt" TIMESTAMP(3);
