/*
  Warnings:

  - Added the required column `roadmap_id` to the `user_roadmap_steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_roadmap_steps" ADD COLUMN     "roadmap_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "user_roadmap_steps_user_id_roadmap_id_created_at_idx" ON "user_roadmap_steps"("user_id", "roadmap_id", "created_at");

-- AddForeignKey
ALTER TABLE "user_roadmap_steps" ADD CONSTRAINT "user_roadmap_steps_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "skill_roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
