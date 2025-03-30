/*
  Warnings:

  - You are about to drop the column `socail_life` on the `feelings` table. All the data in the column will be lost.
  - You are about to drop the `booked` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `social_life` to the `feelings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "booked" DROP CONSTRAINT "booked_apt_id_fkey";

-- DropForeignKey
ALTER TABLE "booked" DROP CONSTRAINT "booked_doctor_id_fkey";

-- AlterTable
ALTER TABLE "feelings" DROP COLUMN "socail_life",
ADD COLUMN     "social_life" INTEGER NOT NULL;

-- DropTable
DROP TABLE "booked";

-- CreateTable
CREATE TABLE "otpverif" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "useremail" INTEGER NOT NULL,

    CONSTRAINT "otpverif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "authKey" TEXT NOT NULL,
    "p256dhKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otpverif_token_key" ON "otpverif"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_endpoint_key" ON "Subscription"("endpoint");

-- AddForeignKey
ALTER TABLE "otpverif" ADD CONSTRAINT "otpverif_useremail_fkey" FOREIGN KEY ("useremail") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot" ADD CONSTRAINT "chatbot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
