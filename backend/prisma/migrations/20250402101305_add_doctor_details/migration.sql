-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "experience" TEXT;

-- CreateTable
CREATE TABLE "DocEducation" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "education" TEXT NOT NULL,

    CONSTRAINT "DocEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocCertification" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "certification" TEXT NOT NULL,

    CONSTRAINT "DocCertification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocEducation" ADD CONSTRAINT "DocEducation_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocCertification" ADD CONSTRAINT "DocCertification_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
