-- CreateTable
CREATE TABLE "user_roadmap_steps" (
    "id" UUID NOT NULL,
    "roadmap_step_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "step_order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roadmap_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_roadmap_steps_user_id_roadmap_step_id_key" ON "user_roadmap_steps"("user_id", "roadmap_step_id");

-- AddForeignKey
ALTER TABLE "user_roadmap_steps" ADD CONSTRAINT "user_roadmap_steps_roadmap_step_id_fkey" FOREIGN KEY ("roadmap_step_id") REFERENCES "roadmap_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roadmap_steps" ADD CONSTRAINT "user_roadmap_steps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
