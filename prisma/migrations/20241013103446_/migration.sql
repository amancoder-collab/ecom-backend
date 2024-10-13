/*
  Warnings:

  - The `shipping_cost` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cod_charges` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "sub_total" INTEGER,
ADD COLUMN     "total_cost" INTEGER,
ALTER COLUMN "estimated_delivery_date" DROP NOT NULL,
ALTER COLUMN "actual_delivery_date" DROP NOT NULL,
DROP COLUMN "shipping_cost",
ADD COLUMN     "shipping_cost" INTEGER,
DROP COLUMN "cod_charges",
ADD COLUMN     "cod_charges" INTEGER;
