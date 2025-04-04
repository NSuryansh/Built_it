-- AlterTable
ALTER TABLE "pastApp" ADD COLUMN     "isDoctor" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "forDoctor" BOOLEAN NOT NULL DEFAULT true;
