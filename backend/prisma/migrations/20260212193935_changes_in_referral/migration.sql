/*
  Warnings:

  - Changed the type of `referred_by` on the `referrals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "referrals" DROP COLUMN "referred_by",
ADD COLUMN     "referred_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_by_fkey" FOREIGN KEY ("referred_by") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
