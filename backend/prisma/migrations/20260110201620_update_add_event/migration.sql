-- AlterTable
ALTER TABLE "events" ADD COLUMN     "batches" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "batch" TEXT NOT NULL DEFAULT '2024';
