-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "token_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_name_key" ON "tokens"("name");
