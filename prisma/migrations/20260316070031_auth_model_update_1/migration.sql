-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
