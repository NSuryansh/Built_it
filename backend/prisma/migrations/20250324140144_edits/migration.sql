-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feelings" (
    "user_id" INTEGER NOT NULL,
    "mental_peace" INTEGER NOT NULL,
    "sleep_quality" INTEGER NOT NULL,
    "socail_life" INTEGER NOT NULL,
    "passion" INTEGER NOT NULL,
    "less_stress_score" INTEGER NOT NULL,
    "happiness_score" INTEGER NOT NULL,

    CONSTRAINT "feelings_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("doc_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feelings" ADD CONSTRAINT "feelings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
