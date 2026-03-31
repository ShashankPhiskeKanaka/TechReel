/*
  Warnings:

  - You are about to drop the column `last_active` on the `streaks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "streaks_user_id_idx";

-- AlterTable
ALTER TABLE "streaks" DROP COLUMN "last_active",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "streaks_id_created_at_idx" ON "streaks"("id", "created_at");
