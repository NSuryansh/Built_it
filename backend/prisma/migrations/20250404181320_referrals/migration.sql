-- CreateTable
CREATE TABLE "referrals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "referred_by" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
