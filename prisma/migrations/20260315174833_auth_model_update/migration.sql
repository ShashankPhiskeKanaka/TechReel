/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "is_valid" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "audit_logs_id_created_at_idx" ON "audit_logs"("id", "created_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "users_id_created_at_idx" ON "users"("id", "created_at");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
