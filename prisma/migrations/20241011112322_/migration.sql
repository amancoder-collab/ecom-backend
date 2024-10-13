/*
  Warnings:

  - You are about to drop the column `address1` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `address` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "address1",
DROP COLUMN "address2",
ADD COLUMN     "address" TEXT NOT NULL;
