/*
  Warnings:

  - You are about to drop the column `color` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `order_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id,product_id,variant_id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "order_items_order_id_product_id_size_color_key";

-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "variant_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "color",
DROP COLUMN "size",
ADD COLUMN     "variant_id" TEXT;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "has_variants" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stock" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_product_id_variant_id_key" ON "order_items"("order_id", "product_id", "variant_id");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
