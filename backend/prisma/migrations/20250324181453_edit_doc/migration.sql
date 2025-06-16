/*
  Warnings:

  - The primary key for the `doctor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doc_id` on the `doctor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "pastApp" DROP CONSTRAINT "pastApp_doc_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_doctor_id_fkey";

-- AlterTable
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_pkey",
DROP COLUMN "doc_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "doctor_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
