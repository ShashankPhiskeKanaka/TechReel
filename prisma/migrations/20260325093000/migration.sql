-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('PRIMARY', 'EXCLUSIVE');

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "type" "TokenType" NOT NULL DEFAULT 'PRIMARY';
