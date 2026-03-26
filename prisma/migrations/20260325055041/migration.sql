/*
  Warnings:

  - A unique constraint covering the columns `[reel_id]` on the table `challenges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reel_id,user_id]` on the table `reel_saves` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reel_id,user_id]` on the table `reel_views` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "challenges_reel_id_key" ON "challenges"("reel_id");

-- CreateIndex
CREATE UNIQUE INDEX "reel_saves_reel_id_user_id_key" ON "reel_saves"("reel_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reel_views_reel_id_user_id_key" ON "reel_views"("reel_id", "user_id");
