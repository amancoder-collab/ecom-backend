/*
  Warnings:

  - You are about to drop the `CouponsUsBy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscribeemail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CouponsUsBy" DROP CONSTRAINT "CouponsUsBy_coupons_id_fkey";

-- DropForeignKey
ALTER TABLE "CouponsUsBy" DROP CONSTRAINT "CouponsUsBy_user_id_fkey";

-- DropForeignKey
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_order_id_fkey";

-- DropTable
DROP TABLE "CouponsUsBy";

-- DropTable
DROP TABLE "orderItem";

-- DropTable
DROP TABLE "subscribeemail";

-- CreateTable
CREATE TABLE "coupons_us_by" (
    "id" TEXT NOT NULL,
    "coupons_id" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_us_by_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "total_amount" TEXT NOT NULL,
    "price_per_unit" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" TEXT,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribe_email" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribe_email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribe_email_email_key" ON "subscribe_email"("email");

-- AddForeignKey
ALTER TABLE "coupons_us_by" ADD CONSTRAINT "coupons_us_by_coupons_id_fkey" FOREIGN KEY ("coupons_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons_us_by" ADD CONSTRAINT "coupons_us_by_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
