-- CreateEnum
CREATE TYPE "Criticality" AS ENUM ('Red', 'Orange', 'Yellow', 'Green');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "criticality" "Criticality" NOT NULL DEFAULT 'Green';
