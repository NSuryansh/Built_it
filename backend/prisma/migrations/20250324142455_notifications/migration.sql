-- CreateTable
CREATE TABLE "notif" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "chat_user" INTEGER NOT NULL,

    CONSTRAINT "notif_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notif" ADD CONSTRAINT "notif_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notif" ADD CONSTRAINT "notif_chat_user_fkey" FOREIGN KEY ("chat_user") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
