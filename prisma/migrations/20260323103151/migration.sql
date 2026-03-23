/*
  Warnings:

  - A unique constraint covering the columns `[user_id,reel_id]` on the table `reel_likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reel_likes_user_id_reel_id_key" ON "reel_likes"("user_id", "reel_id");
