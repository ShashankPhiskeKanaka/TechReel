-- AlterTable
ALTER TABLE "user_certificates" ADD COLUMN     "skillId" UUID;

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;
