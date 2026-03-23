-- DropForeignKey
ALTER TABLE "challenge_submissions" DROP CONSTRAINT "challenge_submissions_roadmap_step_id_fkey";

-- AlterTable
ALTER TABLE "challenge_submissions" ALTER COLUMN "roadmap_step_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "challenge_submissions" ADD CONSTRAINT "challenge_submissions_roadmap_step_id_fkey" FOREIGN KEY ("roadmap_step_id") REFERENCES "roadmap_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
