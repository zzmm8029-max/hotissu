-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN "photoUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "dueDate" DATETIME,
    "proofImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Member" ("createdAt", "dueDate", "id", "nickname", "proofImage", "rejectionReason", "status", "updatedAt") SELECT "createdAt", "dueDate", "id", "nickname", "proofImage", "rejectionReason", "status", "updatedAt" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE INDEX "Member_status_idx" ON "Member"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
