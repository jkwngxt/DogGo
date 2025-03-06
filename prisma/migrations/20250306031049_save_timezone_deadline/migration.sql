-- AlterTable
ALTER TABLE "billing" ALTER COLUMN "ws_deadline" SET DEFAULT NOW() + interval '10 minutes',
ALTER COLUMN "ws_deadline" SET DATA TYPE TIMESTAMPTZ;
