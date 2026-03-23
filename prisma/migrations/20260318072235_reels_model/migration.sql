-- CreateEnum
CREATE TYPE "levels" AS ENUM ('NOVICE', 'COMPETENT', 'PROFICIENT');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('UPLOADED', 'PENDING', 'FAILED');

-- CreateTable
CREATE TABLE "reels" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "video_url" TEXT,
    "creator_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "difficulty_level" "levels" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "tags" JSONB,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "status" NOT NULL,
    "thumbnail_url" TEXT,
    "is_bonus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reels_pkey" PRIMARY KEY ("id")
);
