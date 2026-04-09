-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
