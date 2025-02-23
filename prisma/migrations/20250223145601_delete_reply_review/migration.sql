/*
  Warnings:

  - You are about to drop the column `replyto` on the `review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_replyto_fkey";

-- AlterTable
ALTER TABLE "review" DROP COLUMN "replyto";
