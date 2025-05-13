/*
  Warnings:

  - You are about to drop the `pastDoc` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "isInactive" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "pastDoc";
