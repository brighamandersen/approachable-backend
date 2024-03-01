-- Insert users into User table
INSERT INTO User (firstName, lastName) VALUES ('Taylor', 'English');
INSERT INTO User (firstName, lastName) VALUES ('Brigham', 'Andersen');

-- Insert user locations into UserLocation table
INSERT INTO UserLocation (userId, latitude, longitude) VALUES (1, 40.7128, -74.006);
INSERT INTO UserLocation (userId, latitude, longitude) VALUES (2, 34.0522, -118.2437);