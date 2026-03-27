-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "user_profiles_id_createdAt_idx" ON "user_profiles"("id", "createdAt");
