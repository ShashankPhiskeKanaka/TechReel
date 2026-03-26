/*
  Warnings:

  - You are about to drop the column `type` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `token_id` to the `skill_roadmaps` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tokens_type_key";

-- AlterTable
ALTER TABLE "skill_roadmaps" ADD COLUMN     "token_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "type";

-- AddForeignKey
ALTER TABLE "skill_roadmaps" ADD CONSTRAINT "skill_roadmaps_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
