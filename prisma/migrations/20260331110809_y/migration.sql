/*
  Warnings:

  - A unique constraint covering the columns `[title,creator_id,skill_id]` on the table `reels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reels_title_creator_id_skill_id_key" ON "reels"("title", "creator_id", "skill_id");
