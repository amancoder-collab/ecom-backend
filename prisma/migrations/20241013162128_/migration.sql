/*
  Warnings:

  - A unique constraint covering the columns `[custom_order_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `custom_order_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "courier_company_id" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "custom_order_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_custom_order_id_key" ON "orders"("custom_order_id");
