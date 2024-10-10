/*
  Warnings:

  - You are about to drop the column `company_name` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `gst_number` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `house_number` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `your_name` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `address1` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address2` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "company_name",
DROP COLUMN "gst_number",
DROP COLUMN "house_number",
DROP COLUMN "street",
DROP COLUMN "your_name",
ADD COLUMN     "address1" TEXT NOT NULL,
ADD COLUMN     "address2" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL;
