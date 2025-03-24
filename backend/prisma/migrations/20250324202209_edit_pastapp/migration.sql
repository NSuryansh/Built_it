-- DropForeignKey
ALTER TABLE "pastApp" DROP CONSTRAINT "pastApp_doc_id_fkey";

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
