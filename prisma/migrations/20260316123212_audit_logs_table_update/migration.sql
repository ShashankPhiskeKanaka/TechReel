-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "performed_by" DROP NOT NULL,
ALTER COLUMN "ip" DROP NOT NULL;
