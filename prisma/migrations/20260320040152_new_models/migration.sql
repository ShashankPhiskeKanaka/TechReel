-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "token_ledger" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "token_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_token_balance" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_token_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_ledger" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "xp_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "current_streak" INTEGER NOT NULL,
    "longest_streak" INTEGER NOT NULL,
    "last_active" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "xp" INTEGER NOT NULL,
    "difficulty_level" "levels" NOT NULL,
    "last_updated" TIMESTAMPTZ NOT NULL,
    "progress" INTEGER NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_roadmaps" (
    "id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "difficulty_level" "levels" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "token_ledger_id_created_at_idx" ON "token_ledger"("id", "created_at");

-- CreateIndex
CREATE INDEX "token_ledger_user_id_idx" ON "token_ledger"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_token_balance_user_id_key" ON "user_token_balance"("user_id");

-- CreateIndex
CREATE INDEX "user_token_balance_id_created_at_idx" ON "user_token_balance"("id", "created_at");

-- CreateIndex
CREATE INDEX "user_token_balance_user_id_idx" ON "user_token_balance"("user_id");

-- CreateIndex
CREATE INDEX "xp_ledger_user_id_idx" ON "xp_ledger"("user_id");

-- CreateIndex
CREATE INDEX "xp_ledger_id_created_at_idx" ON "xp_ledger"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "streaks_user_id_key" ON "streaks"("user_id");

-- CreateIndex
CREATE INDEX "streaks_user_id_idx" ON "streaks"("user_id");

-- CreateIndex
CREATE INDEX "user_skills_user_id_idx" ON "user_skills"("user_id");

-- CreateIndex
CREATE INDEX "user_skills_id_completed_at_idx" ON "user_skills"("id", "completed_at");

-- CreateIndex
CREATE INDEX "skill_roadmaps_skill_id_idx" ON "skill_roadmaps"("skill_id");

-- CreateIndex
CREATE INDEX "reels_id_created_at_idx" ON "reels"("id", "created_at");

-- CreateIndex
CREATE INDEX "skills_id_created_at_idx" ON "skills"("id", "created_at");

-- CreateIndex
CREATE INDEX "tags_id_created_at_idx" ON "tags"("id", "created_at");

-- CreateIndex
CREATE INDEX "tokens_id_created_at_idx" ON "tokens"("id", "created_at");

-- AddForeignKey
ALTER TABLE "reels" ADD CONSTRAINT "reels_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reels" ADD CONSTRAINT "reels_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_ledger" ADD CONSTRAINT "token_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_ledger" ADD CONSTRAINT "token_ledger_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token_balance" ADD CONSTRAINT "user_token_balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token_balance" ADD CONSTRAINT "user_token_balance_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_ledger" ADD CONSTRAINT "xp_ledger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_roadmaps" ADD CONSTRAINT "skill_roadmaps_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
