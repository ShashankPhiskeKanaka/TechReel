-- DropIndex
DROP INDEX "reels_video_url_key";

-- AlterTable
ALTER TABLE "reels" ALTER COLUMN "video_url" DROP NOT NULL;
