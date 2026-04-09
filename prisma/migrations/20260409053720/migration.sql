-- CreateTable
CREATE TABLE "user_certificates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_certificates_id_created_at_idx" ON "user_certificates"("id", "created_at");
