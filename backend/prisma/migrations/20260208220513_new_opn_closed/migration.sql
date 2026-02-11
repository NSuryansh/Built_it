-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "caseStatus" "CaseStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "pastApp" ADD COLUMN     "caseStatus" "CaseStatus" NOT NULL DEFAULT 'OPEN';
