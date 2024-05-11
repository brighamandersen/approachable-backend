-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "bio" TEXT,
    "birthDate" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT 'test@gmail.com',
    "firstName" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "interestedInBusiness" BOOLEAN NOT NULL DEFAULT false,
    "interestedInDating" BOOLEAN NOT NULL DEFAULT false,
    "interestedInFriends" BOOLEAN NOT NULL DEFAULT false,
    "interestedInHelp" BOOLEAN NOT NULL DEFAULT false,
    "lastName" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "locationLastUpdated" INTEGER NOT NULL,
    "longitude" REAL NOT NULL,
    "profilePicture" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_User" ("bio", "birthDate", "firstName", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude", "profilePicture", "visible") SELECT "bio", "birthDate", "firstName", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude", "profilePicture", "visible" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
