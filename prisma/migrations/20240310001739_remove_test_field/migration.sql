/*
  Warnings:

  - You are about to drop the column `testField` on the `User` table. All the data in the column will be lost.

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
