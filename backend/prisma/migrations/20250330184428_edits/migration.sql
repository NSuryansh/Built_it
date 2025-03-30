/*
  Warnings:

  - Added the required column `acadProg` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "acadProg" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "slots" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "starting_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_leave" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booked" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "starting_time" TIMESTAMP(3) NOT NULL,
    "apt_id" INTEGER NOT NULL,

    CONSTRAINT "booked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_leave" ADD CONSTRAINT "doctor_leave_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked" ADD CONSTRAINT "booked_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked" ADD CONSTRAINT "booked_apt_id_fkey" FOREIGN KEY ("apt_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
