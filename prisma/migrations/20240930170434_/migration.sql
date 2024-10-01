/*
  Warnings:

  - You are about to drop the `subscribe_email` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "subscribe_email";

-- CreateTable
CREATE TABLE "subscribe" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribe_email_key" ON "subscribe"("email");
