import { Feet, UnixTimestamp, User } from './types';

export function getCurrentTimestamp(): UnixTimestamp {
  return Math.floor(Date.now() / 1000);
}

// Calculate the distance between two coordinates using the Haversine formula
export function calculateDistanceBetweenCoordinates(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): Feet {
  const FEET_PER_DEGREE_LATITUDE = 364000;
  const FEET_PER_DEGREE_LONGITUDE = 288200;

  const latitudeDistance: Feet =
    (latitude2 - latitude1) * FEET_PER_DEGREE_LATITUDE;

  const longitudeDistance: Feet =
    (longitude2 - longitude1) * FEET_PER_DEGREE_LONGITUDE;

  // Pythagorean theorem to calculate straight-line distance
  const diagonalDistance: Feet = Math.sqrt(
    latitudeDistance ** 2 + longitudeDistance ** 2
  );

  return diagonalDistance;
}

export function getUsersWithinRadius(
  allUsers: User[],
  latitude: number,
  longitude: number,
  radiusInFeet: Feet
): User[] {
  const usersWithinRadius: User[] = [];

  // Iterate through each user and check if they are within the radius
  for (const user of allUsers) {
    const distance = calculateDistanceBetweenCoordinates(
      latitude,
      longitude,
      user.latitude,
      user.longitude
    );
    if (distance <= radiusInFeet) {
      usersWithinRadius.push(user);
    }
  }

  return usersWithinRadius;
}
