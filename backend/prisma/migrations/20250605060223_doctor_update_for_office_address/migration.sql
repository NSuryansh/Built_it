-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "office_address" TEXT;
