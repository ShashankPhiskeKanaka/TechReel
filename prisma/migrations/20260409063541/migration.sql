/*
  Warnings:

  - A unique constraint covering the columns `[name,skill_id]` on the table `badges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "badges_name_skill_id_key" ON "badges"("name", "skill_id");
