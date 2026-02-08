/*
  Warnings:

  - You are about to drop the column `driveFolderId` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "driveFolderId",
ADD COLUMN     "folderLink" TEXT;
