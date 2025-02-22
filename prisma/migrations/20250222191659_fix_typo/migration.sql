/*
  Warnings:

  - You are about to drop the column `c_purches` on the `coupon` table. All the data in the column will be lost.
  - Added the required column `c_purchase` to the `coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupon" DROP COLUMN "c_purches",
ADD COLUMN     "c_purchase" TIMESTAMP NOT NULL;
