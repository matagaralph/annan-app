-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "webhook_id" TEXT NOT NULL,
    "order_number" TEXT,
    "api_version" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false
);
