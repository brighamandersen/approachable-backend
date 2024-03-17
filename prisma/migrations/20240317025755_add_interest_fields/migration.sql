-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" INTEGER NOT NULL,
    "bio" TEXT,
    "interestedInFriends" BOOLEAN NOT NULL DEFAULT false,
    "interestedInDating" BOOLEAN NOT NULL DEFAULT false,
    "interestingInBusiness" BOOLEAN NOT NULL DEFAULT false,
    "interestedInHelp" BOOLEAN NOT NULL DEFAULT false,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "locationLastUpdated" INTEGER NOT NULL
);
INSERT INTO "new_User" ("bio", "birthDate", "firstName", "id", "lastName", "latitude", "locationLastUpdated", "longitude") SELECT "bio", "birthDate", "firstName", "id", "lastName", "latitude", "locationLastUpdated", "longitude" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
