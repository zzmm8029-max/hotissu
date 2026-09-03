-- AlterTable
ALTER TABLE "Post" ADD COLUMN "amount" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Merchant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "benefitInfo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "district" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "phone" TEXT,
    "homepage" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "isFoundingPartner" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Merchant" ("address", "benefitInfo", "category", "createdAt", "description", "district", "homepage", "id", "latitude", "longitude", "name", "phone", "region", "sourceName", "sourceUrl", "updatedAt") SELECT "address", "benefitInfo", "category", "createdAt", "description", "district", "homepage", "id", "latitude", "longitude", "name", "phone", "region", "sourceName", "sourceUrl", "updatedAt" FROM "Merchant";
DROP TABLE "Merchant";
ALTER TABLE "new_Merchant" RENAME TO "Merchant";
CREATE INDEX "Merchant_category_idx" ON "Merchant"("category");
CREATE INDEX "Merchant_region_district_idx" ON "Merchant"("region", "district");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
