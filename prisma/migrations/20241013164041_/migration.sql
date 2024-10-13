/*
  Warnings:

  - The `courier_company_id` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "courier_company_id",
ADD COLUMN     "courier_company_id" INTEGER;
