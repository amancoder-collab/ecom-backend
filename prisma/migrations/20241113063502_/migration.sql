/*
  Warnings:

  - Added the required column `height` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "discountedPrice" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL;
