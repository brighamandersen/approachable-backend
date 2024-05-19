/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bio" TEXT,
    "birthDate" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "interestedInBusiness" BOOLEAN NOT NULL DEFAULT false,
    "interestedInDating" BOOLEAN NOT NULL DEFAULT false,
    "interestedInFriends" BOOLEAN NOT NULL DEFAULT false,
    "interestedInHelp" BOOLEAN NOT NULL DEFAULT false,
    "lastName" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "locationLastUpdated" INTEGER NOT NULL,
    "longitude" REAL NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_User" ("bio", "birthDate", "email", "firstName", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude", "password", "profilePicture", "visible") SELECT "bio", "birthDate", "email", "firstName", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude", "password", "profilePicture", "visible" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
