/*
  Warnings:

  - You are about to drop the column `is_valid` on the `refresh_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "is_valid",
ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;
