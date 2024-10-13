/*
  Warnings:

  - You are about to drop the column `order_id` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ship_rocket_order_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ship_rocket_order_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "orders_order_id_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "order_id",
ADD COLUMN     "ship_rocket_order_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_ship_rocket_order_id_key" ON "orders"("ship_rocket_order_id");
