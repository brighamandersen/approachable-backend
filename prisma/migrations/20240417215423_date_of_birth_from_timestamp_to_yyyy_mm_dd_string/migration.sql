-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "bio" TEXT,
    "birthDate" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "hiddenOnMap" BOOLEAN NOT NULL DEFAULT false,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "interestedInBusiness" BOOLEAN NOT NULL DEFAULT false,
    "interestedInDating" BOOLEAN NOT NULL DEFAULT false,
    "interestedInFriends" BOOLEAN NOT NULL DEFAULT false,
    "interestedInHelp" BOOLEAN NOT NULL DEFAULT false,
    "lastName" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "locationLastUpdated" INTEGER NOT NULL,
    "longitude" REAL NOT NULL,
    "profilePicture" TEXT
);
INSERT INTO "new_User" ("bio", "birthDate", "firstName", "hiddenOnMap", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude", "profilePicture") SELECT "bio", "birthDate", "firstName", "hiddenOnMap", "id", "interestedInBusiness", "interestedInDating", "interestedInFriends", "interestedInHelp", "lastName", "latitude", "locationLastUpdated", "longitude", "profilePicture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
