/*
  Warnings:

  - You are about to drop the column `is_live` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `specification` on the `products` table. All the data in the column will be lost.
  - Added the required column `price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "discountedPrice" INTEGER,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "is_live",
DROP COLUMN "specification",
ALTER COLUMN "descounted_price" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;
