/*
  Warnings:

  - You are about to drop the column `pdfLinks` on the `pastApp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pastApp" DROP COLUMN "pdfLinks",
ADD COLUMN     "pdfLink" TEXT;
