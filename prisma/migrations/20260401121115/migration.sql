/*
  Warnings:

  - A unique constraint covering the columns `[roadmap_id,step_order]` on the table `roadmap_steps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roadmap_steps_roadmap_id_step_order_key" ON "roadmap_steps"("roadmap_id", "step_order");
