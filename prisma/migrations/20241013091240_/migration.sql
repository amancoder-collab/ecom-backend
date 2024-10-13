/*
  Warnings:

  - You are about to drop the column `price_per_unit` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_detail` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `gst_in` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_number` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `other_cost` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `price_per_unit` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tracking_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tracking_status` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id,product_id,size,color]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `pincode` on the `addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `product_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `quantity` on the `order_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `cod_charges` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_product_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "pincode",
ADD COLUMN     "pincode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "price_per_unit",
DROP COLUMN "total_amount",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "quantity",
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "delivery_detail",
DROP COLUMN "gst_in",
DROP COLUMN "order_number",
DROP COLUMN "order_status",
DROP COLUMN "other_cost",
DROP COLUMN "price_per_unit",
DROP COLUMN "product_id",
DROP COLUMN "total_amount",
DROP COLUMN "tracking_id",
DROP COLUMN "tracking_status",
ADD COLUMN     "billing_address_id" TEXT,
ADD COLUMN     "cod_charges" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "shipping_address_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_product_id_size_color_key" ON "order_items"("order_id", "product_id", "size", "color");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
