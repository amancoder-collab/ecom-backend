/*
  Warnings:

  - Made the column `breadth` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `length` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "breadth" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL;
