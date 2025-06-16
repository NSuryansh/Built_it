/*
  Warnings:

  - Added the required column `password` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pastApp" DROP CONSTRAINT "pastApp_doc_id_fkey";

-- DropForeignKey
ALTER TABLE "pastApp" DROP CONSTRAINT "pastApp_user_id_fkey";

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pastApp" ALTER COLUMN "doc_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
