/*
  Warnings:

  - Made the column `estimated_delivery_date` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `billing_address_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shipping_address_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sub_total` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_cost` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shipping_cost` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cod_charges` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "estimated_delivery_date" SET NOT NULL,
ALTER COLUMN "billing_address_id" SET NOT NULL,
ALTER COLUMN "shipping_address_id" SET NOT NULL,
ALTER COLUMN "sub_total" SET NOT NULL,
ALTER COLUMN "total_cost" SET NOT NULL,
ALTER COLUMN "shipping_cost" SET NOT NULL,
ALTER COLUMN "cod_charges" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
