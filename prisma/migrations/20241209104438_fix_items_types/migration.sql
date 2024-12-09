-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "webhook_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "api_version" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Product" ("api_version", "id", "payload", "product_id", "shop", "sku", "status", "topic", "webhook_id") SELECT "api_version", "id", "payload", "product_id", "shop", "sku", "status", "topic", "webhook_id" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
