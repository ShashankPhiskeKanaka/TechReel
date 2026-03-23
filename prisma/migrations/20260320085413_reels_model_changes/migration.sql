/*
  Warnings:

  - A unique constraint covering the columns `[video_url]` on the table `reels` will be added. If there are existing duplicate values, this will fail.
  - Made the column `video_url` on table `reels` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reels" ALTER COLUMN "video_url" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reels_video_url_key" ON "reels"("video_url");
