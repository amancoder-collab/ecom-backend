/*
  Warnings:

  - You are about to drop the column `land_mark` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "land_mark",
DROP COLUMN "phone_number";
