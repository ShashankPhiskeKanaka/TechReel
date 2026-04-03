-- DropForeignKey
ALTER TABLE "challenge_submissions" DROP CONSTRAINT "challenge_submissions_challenge_id_fkey";

-- AlterTable
ALTER TABLE "challenge_submissions" ALTER COLUMN "challenge_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "challenge_submissions" ADD CONSTRAINT "challenge_submissions_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE SET NULL ON UPDATE CASCADE;
