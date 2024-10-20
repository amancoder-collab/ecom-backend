/*
  Warnings:

  - You are about to drop the column `breadth` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `colors` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id,sku,color,size]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `breadth` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_variants_product_id_color_size_key";

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "breadth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "breadth",
DROP COLUMN "colors",
DROP COLUMN "height",
DROP COLUMN "images",
DROP COLUMN "length",
DROP COLUMN "sku",
DROP COLUMN "weight";

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_sku_color_size_key" ON "product_variants"("product_id", "sku", "color", "size");
