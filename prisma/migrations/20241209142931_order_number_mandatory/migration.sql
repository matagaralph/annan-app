/*
  Warnings:

  - Made the column `order_number` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "webhook_id" TEXT NOT NULL,
    "order_number" INTEGER NOT NULL,
    "api_version" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "order_id" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Order" ("api_version", "id", "order_id", "order_number", "payload", "shop", "status", "topic", "webhook_id") SELECT "api_version", "id", "order_id", "order_number", "payload", "shop", "status", "topic", "webhook_id" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
