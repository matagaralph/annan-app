-- AlterTable
ALTER TABLE "Order" ADD COLUMN "order_id" TEXT;

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "webhook_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "api_version" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "product_id" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false
);
