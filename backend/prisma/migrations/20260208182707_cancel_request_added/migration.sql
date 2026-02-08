-- CreateTable
CREATE TABLE "cancelled_request" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "forDoctor" BOOLEAN NOT NULL DEFAULT false,
    "appointmentTime" TIMESTAMP(3),
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancelled_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cancelled_request_user_id_idx" ON "cancelled_request"("user_id");

-- CreateIndex
CREATE INDEX "cancelled_request_doctor_id_idx" ON "cancelled_request"("doctor_id");

-- AddForeignKey
ALTER TABLE "cancelled_request" ADD CONSTRAINT "cancelled_request_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancelled_request" ADD CONSTRAINT "cancelled_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
