/*
  Warnings:

  - A unique constraint covering the columns `[channel_order_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shipment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channel_order_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipment_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "awb_code" TEXT,
ADD COLUMN     "channel_order_id" TEXT NOT NULL,
ADD COLUMN     "courier_company_id" TEXT,
ADD COLUMN     "shipment_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_channel_order_id_key" ON "orders"("channel_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_shipment_id_key" ON "orders"("shipment_id");
