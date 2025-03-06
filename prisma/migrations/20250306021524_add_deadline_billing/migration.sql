-- AlterTable
ALTER TABLE "billing" ADD COLUMN     "ws_deadline" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '10 minutes';
