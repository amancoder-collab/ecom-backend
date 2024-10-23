/*
  Warnings:

  - Made the column `thumbnail` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "thumbnail" SET NOT NULL;
