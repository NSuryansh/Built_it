/*
  Warnings:

  - Added the required column `authTag` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "authTag" TEXT NOT NULL;
