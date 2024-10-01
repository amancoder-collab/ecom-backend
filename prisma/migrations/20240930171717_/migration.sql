/*
  Warnings:

  - You are about to drop the column `descounted_prices` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `gst` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price_without_gst` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantities` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `products` table. All the data in the column will be lost.
  - Added the required column `descounted_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceWithoutTax` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_price_without_gst_product_name_descounted_prices_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "descounted_prices",
DROP COLUMN "gst",
DROP COLUMN "price_without_gst",
DROP COLUMN "product_description",
DROP COLUMN "product_name",
DROP COLUMN "quantities",
DROP COLUMN "size",
ADD COLUMN     "descounted_price" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "priceWithoutTax" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "sizes" TEXT[],
ADD COLUMN     "tax" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "products_priceWithoutTax_name_descounted_price_idx" ON "products"("priceWithoutTax", "name", "descounted_price");
