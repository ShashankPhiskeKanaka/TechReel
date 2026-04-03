-- AlterTable
ALTER TABLE "reels" ADD COLUMN     "search_vector" tsvector;

-- CreateIndex
CREATE INDEX "reels_tags_idx" ON "reels" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "reels_search_vector_idx" ON "reels" USING GIN ("search_vector");
