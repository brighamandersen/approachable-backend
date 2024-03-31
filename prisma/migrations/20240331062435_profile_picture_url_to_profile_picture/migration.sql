/*
  Warnings:

  - You are about to drop the column `profilePictureUrl` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" INTEGER NOT NULL,
    "profilePicture" TEXT,
    "bio" TEXT,
    "hiddenOnMap" BOOLEAN NOT NULL DEFAULT false,
    "interestedInFriends" BOOLEAN NOT NULL DEFAULT false,
    "interestedInDating" BOOLEAN NOT NULL DEFAULT false,
    "interestedInBusiness" BOOLEAN NOT NULL DEFAULT false,
    "interestedInHelp" BOOLEAN NOT NULL DEFAULT false,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "locationLastUpdated" INTEGER NOT NULL
);
INSERT INTO "new_User" ("bio", "birthDate", "firstName", "hiddenOnMap", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude") SELECT "bio", "birthDate", "firstName", "hiddenOnMap", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
