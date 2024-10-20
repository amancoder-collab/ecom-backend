/*
  Warnings:

  - You are about to drop the `_ProductAttributeToProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[attribute_id,variant_id]` on the table `product_attribute_values` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_ProductAttributeToProductVariant" DROP CONSTRAINT "_ProductAttributeToProductVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductAttributeToProductVariant" DROP CONSTRAINT "_ProductAttributeToProductVariant_B_fkey";

-- DropTable
DROP TABLE "_ProductAttributeToProductVariant";

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_attribute_id_variant_id_key" ON "product_attribute_values"("attribute_id", "variant_id");
