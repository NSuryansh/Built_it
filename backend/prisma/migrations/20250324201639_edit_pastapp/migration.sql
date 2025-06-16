-- DropForeignKey
ALTER TABLE "pastApp" DROP CONSTRAINT "pastApp_user_id_fkey";

-- AddForeignKey
ALTER TABLE "pastApp" ADD CONSTRAINT "pastApp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
