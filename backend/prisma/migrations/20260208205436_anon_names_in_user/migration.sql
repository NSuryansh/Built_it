/*
  Warnings:

  - A unique constraint covering the columns `[randomName]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "randomName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_randomName_key" ON "user"("randomName");
