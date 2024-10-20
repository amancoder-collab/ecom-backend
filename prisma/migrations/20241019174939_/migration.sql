/*
  Warnings:

  - You are about to drop the column `color` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `cart_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cart_id,variant_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variant_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cart_items_cart_id_product_id_size_color_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "color",
DROP COLUMN "size",
ADD COLUMN     "variant_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_variant_id_key" ON "cart_items"("cart_id", "variant_id");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
