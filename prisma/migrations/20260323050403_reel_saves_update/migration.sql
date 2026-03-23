-- CreateIndex
CREATE INDEX "reel_saves_folder_name_idx" ON "reel_saves"("folder_name");

-- CreateIndex
CREATE INDEX "reel_saves_id_saved_at_idx" ON "reel_saves"("id", "saved_at");

-- AddForeignKey
ALTER TABLE "reel_saves" ADD CONSTRAINT "reel_saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reel_saves" ADD CONSTRAINT "reel_saves_reel_id_fkey" FOREIGN KEY ("reel_id") REFERENCES "reels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
