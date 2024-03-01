CREATE TABLE IF NOT EXISTS User (
  id INTEGER NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  PRIMARY KEY(id AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS UserLocation (
  userId INTEGER NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  PRIMARY KEY(userId),
  FOREIGN KEY(userId) REFERENCES User(id)
);