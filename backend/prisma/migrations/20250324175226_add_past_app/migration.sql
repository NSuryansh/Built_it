-- AlterTable
ALTER TABLE "notif" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "pastApp" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "doc_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "pastApp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doctor"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
