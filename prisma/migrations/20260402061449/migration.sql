/*
  Warnings:

  - You are about to drop the column `saved_at` on the `reel_saves` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "reel_saves_id_saved_at_idx";

-- AlterTable
ALTER TABLE "reel_saves" DROP COLUMN "saved_at",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "reel_saves_id_created_at_idx" ON "reel_saves"("id", "created_at");
