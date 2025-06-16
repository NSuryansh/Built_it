/*
  Warnings:

  - You are about to drop the column `authKey` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `p256dhKey` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "authKey",
DROP COLUMN "p256dhKey";
