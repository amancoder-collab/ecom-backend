/*
  Warnings:

  - Added the required column `expires_at` to the `ship_rocket_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ship_rocket_token" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
