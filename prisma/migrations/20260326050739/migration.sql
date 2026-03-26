/*
  Warnings:

  - Changed the type of `reason` on the `reel_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `reel_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('HARRASSMENT', 'HATESPEECH', 'SCAM', 'VIOLENCE', 'MISINFORMATION', 'NSFW', 'SPAM');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "reel_reports" DROP COLUMN "reason",
ADD COLUMN     "reason" "ReportReason" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL;

-- DropEnum
DROP TYPE "reportStatus";
