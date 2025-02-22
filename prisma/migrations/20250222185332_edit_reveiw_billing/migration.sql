-- DropForeignKey
ALTER TABLE "billing" DROP CONSTRAINT "billing_c_id_fkey";

-- DropForeignKey
ALTER TABLE "billing" DROP CONSTRAINT "billing_ws_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_c_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_ws_id_fkey";

-- AlterTable
ALTER TABLE "billing" ALTER COLUMN "c_id" DROP NOT NULL,
ALTER COLUMN "ws_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "c_id" DROP NOT NULL,
ALTER COLUMN "ws_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "coupon"("c_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_ws_id_fkey" FOREIGN KEY ("ws_id") REFERENCES "walking_service"("ws_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "coupon"("c_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_ws_id_fkey" FOREIGN KEY ("ws_id") REFERENCES "walking_service"("ws_id") ON DELETE SET NULL ON UPDATE CASCADE;
