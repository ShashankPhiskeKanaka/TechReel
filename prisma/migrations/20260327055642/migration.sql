-- AlterTable
ALTER TABLE "challenge_options" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ;
