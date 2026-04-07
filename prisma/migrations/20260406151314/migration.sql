/*
  Warnings:

  - You are about to drop the column `created_at` on the `reel_saves` table. All the data in the column will be lost.
  - You are about to drop the column `search_vector` on the `reels` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('USER', 'TOKEN');

-- DropForeignKey
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_reel_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "reel_folders" DROP CONSTRAINT "reel_folders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "roadmap_steps" DROP CONSTRAINT "roadmap_steps_challenge_id_fkey";

-- DropIndex
DROP INDEX "reel_saves_id_created_at_idx";

-- DropIndex
DROP INDEX "reels_search_vector_idx";

-- DropIndex
DROP INDEX "reels_tags_idx";

-- DropIndex
DROP INDEX "reels_title_creator_id_skill_id_key";

-- DropIndex
DROP INDEX "roadmap_steps_roadmap_id_step_order_key";

-- AlterTable
ALTER TABLE "reel_saves" DROP COLUMN "created_at",
ADD COLUMN     "saved_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reels" DROP COLUMN "search_vector";

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "avatar_url";

-- DropTable
DROP TABLE "notifications";

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,
    "resource_type" "ResourceType" NOT NULL,
    "resource_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "images_resource_id_resource_type_idx" ON "images"("resource_id", "resource_type");

-- CreateIndex
CREATE INDEX "images_id_created_at_idx" ON "images"("id", "created_at");

-- CreateIndex
CREATE INDEX "reel_saves_folder_id_idx" ON "reel_saves"("folder_id");

-- CreateIndex
CREATE INDEX "reel_saves_id_saved_at_idx" ON "reel_saves"("id", "saved_at");

-- AddForeignKey
ALTER TABLE "reel_folders" ADD CONSTRAINT "reel_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_reel_id_fkey" FOREIGN KEY ("reel_id") REFERENCES "reels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
