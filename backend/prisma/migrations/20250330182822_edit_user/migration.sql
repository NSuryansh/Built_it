/*
  Warnings:

  - A unique constraint covering the columns `[rollNo]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollNo` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "rollNo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_rollNo_key" ON "user"("rollNo");
