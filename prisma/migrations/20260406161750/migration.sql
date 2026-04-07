/*
  Warnings:

  - A unique constraint covering the columns `[resource_id]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "images" ALTER COLUMN "url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "images_resource_id_key" ON "images"("resource_id");
