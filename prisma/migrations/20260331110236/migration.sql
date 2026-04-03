-- DropForeignKey
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_reel_id_fkey";

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_reel_id_fkey" FOREIGN KEY ("reel_id") REFERENCES "reels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
