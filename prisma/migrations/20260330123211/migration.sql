-- DropForeignKey
ALTER TABLE "token_ledger" DROP CONSTRAINT "token_ledger_token_id_fkey";

-- DropForeignKey
ALTER TABLE "user_token_balance" DROP CONSTRAINT "user_token_balance_token_id_fkey";

-- AlterTable
ALTER TABLE "token_ledger" ALTER COLUMN "token_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_token_balance" ALTER COLUMN "token_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "token_ledger" ADD CONSTRAINT "token_ledger_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token_balance" ADD CONSTRAINT "user_token_balance_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
