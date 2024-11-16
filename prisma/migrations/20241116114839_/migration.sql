/*
  Warnings:

  - You are about to drop the column `discountedPrice` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "order_items_order_id_product_id_variant_id_key";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "discountedPrice",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discounted_price" INTEGER,
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
ALTER COLUMN "estimated_delivery_date" DROP NOT NULL,
ALTER COLUMN "sub_total" DROP NOT NULL,
ALTER COLUMN "total_cost" DROP NOT NULL,
ALTER COLUMN "shipping_cost" DROP NOT NULL,
ALTER COLUMN "cod_charges" DROP NOT NULL;
