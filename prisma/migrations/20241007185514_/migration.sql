-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "billing_address_id" TEXT,
ADD COLUMN     "shipping_address_id" TEXT;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
