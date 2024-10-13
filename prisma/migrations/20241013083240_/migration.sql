/*
  Warnings:

  - Added the required column `address_2` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_date` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "address_2" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "order_id" TEXT NOT NULL;
