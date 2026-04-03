/*
  Warnings:

  - You are about to drop the column `folder_name` on the `reel_saves` table. All the data in the column will be lost.
  - Added the required column `folder_id` to the `reel_saves` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reel_saves_folder_name_idx";

-- AlterTable
ALTER TABLE "reel_saves" DROP COLUMN "folder_name",
ADD COLUMN     "folder_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "reel_folders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reel_folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reel_folders_id_created_at_idx" ON "reel_folders"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "reel_folders_user_id_name_key" ON "reel_folders"("user_id", "name");

-- AddForeignKey
ALTER TABLE "reel_folders" ADD CONSTRAINT "reel_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reel_saves" ADD CONSTRAINT "reel_saves_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "reel_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
