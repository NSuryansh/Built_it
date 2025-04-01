-- CreateTable
CREATE TABLE "EmergencyApp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "EmergencyApp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyApp_email_key" ON "EmergencyApp"("email");

-- AddForeignKey
ALTER TABLE "EmergencyApp" ADD CONSTRAINT "EmergencyApp_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
