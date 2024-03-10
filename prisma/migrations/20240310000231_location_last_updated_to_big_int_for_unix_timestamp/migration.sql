/*
  Warnings:

  - You are about to alter the column `locationLastUpdated` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "locationLastUpdated" BIGINT NOT NULL
);
INSERT INTO "new_User" ("firstName", "id", "lastName", "latitude", "locationLastUpdated", "longitude") SELECT "firstName", "id", "lastName", "latitude", "locationLastUpdated", "longitude" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
