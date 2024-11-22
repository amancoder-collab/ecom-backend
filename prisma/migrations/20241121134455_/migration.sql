-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "ship_rocket_order_id" DROP NOT NULL,
ALTER COLUMN "custom_order_id" DROP NOT NULL,
ALTER COLUMN "shipment_id" DROP NOT NULL;
