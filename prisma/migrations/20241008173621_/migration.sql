-- CreateTable
CREATE TABLE "ship_rocket_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ship_rocket_token_pkey" PRIMARY KEY ("id")
);
