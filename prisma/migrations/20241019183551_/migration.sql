/*
  Warnings:

  - You are about to drop the column `priceWithoutTax` on the `products` table. All the data in the column will be lost.
  - Added the required column `price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_priceWithoutTax_name_descounted_price_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "priceWithoutTax",
ADD COLUMN     "price" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductAttributeToProductVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_product_id_name_value_key" ON "product_attributes"("product_id", "name", "value");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductAttributeToProductVariant_AB_unique" ON "_ProductAttributeToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductAttributeToProductVariant_B_index" ON "_ProductAttributeToProductVariant"("B");

-- CreateIndex
CREATE INDEX "products_price_name_descounted_price_idx" ON "products"("price", "name", "descounted_price");

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAttributeToProductVariant" ADD CONSTRAINT "_ProductAttributeToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "product_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAttributeToProductVariant" ADD CONSTRAINT "_ProductAttributeToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
