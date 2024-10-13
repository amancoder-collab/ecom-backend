/*
  Warnings:

  - You are about to drop the column `channel_order_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "orders_channel_order_id_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "channel_order_id";
