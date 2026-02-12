/*
  Warnings:

  - You are about to drop the column `folderLink` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "folderLink",
ADD COLUMN     "driveFolderId" TEXT,
ADD COLUMN     "googleDriveLinked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleRefreshToken" TEXT;

-- AlterTable
ALTER TABLE "referrals" ADD COLUMN     "isShow" BOOLEAN NOT NULL DEFAULT false;
