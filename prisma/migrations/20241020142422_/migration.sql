/*
  Warnings:

  - You are about to drop the column `name` on the `product_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `product_attributes` table. All the data in the column will be lost.
  - Added the required column `title` to the `product_attributes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_attributes_product_id_name_value_key";

-- AlterTable
ALTER TABLE "product_attributes" DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "product_attribute_values" (
    "id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "variant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "product_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
