-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
