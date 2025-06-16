/*
  Warnings:

  - Changed the type of `token` on the `otpverif` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "otpverif_token_key";

-- AlterTable
ALTER TABLE "otpverif" DROP COLUMN "token",
ADD COLUMN     "token" INTEGER NOT NULL;
