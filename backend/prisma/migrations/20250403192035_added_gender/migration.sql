/*
  Warnings:

  - Added the required column `gender` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Non-Binary', 'Other');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "gender" "Gender" NOT NULL;
