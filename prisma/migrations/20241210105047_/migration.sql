/*
  Warnings:

  - A unique constraint covering the columns `[attribute_id,variant_id]` on the table `product_attribute_values` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_attribute_id_variant_id_key" ON "product_attribute_values"("attribute_id", "variant_id");
