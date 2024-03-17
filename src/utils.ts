import { Meters, UnixTimestamp, User } from './types';

export function isSet(variable: any): boolean {
  return variable !== undefined && variable !== null;
}

export function getCurrentTimestamp(): UnixTimestamp {
  return Math.floor(Date.now() / 1000);
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Calculate the distance between two coordinates using the Haversine formula
export function calculateDistanceBetweenCoordinates(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): Meters {
  const EARTH_RADIUS_IN_METERS = 6378137;

  const latitude1InRadians = degreesToRadians(latitude1);
  const latitude2InRadians = degreesToRadians(latitude2);
  const longitude1InRadians = degreesToRadians(longitude1);
  const longitude2InRadians = degreesToRadians(longitude2);

  const latitudeDifference = latitude2InRadians - latitude1InRadians;
  const longitudeDifference = longitude2InRadians - longitude1InRadians;

  const haversineA =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(latitude1InRadians) *
      Math.cos(latitude2InRadians) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);
  const haversineC =
    2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));

  const distanceInMeters = EARTH_RADIUS_IN_METERS * haversineC;
  console.log({ distanceInMeters });
  return distanceInMeters;
}

export function getUsersWithinRadius(
  users: User[],
  latitude: number,
  longitude: number,
  radiusInMeters: Meters
): User[] {
  const usersWithinRadius: User[] = [];

  // Iterate through each user and check if they are within the radius
  for (const user of users) {
    const distance = calculateDistanceBetweenCoordinates(
      latitude,
      longitude,
      user.latitude,
      user.longitude
    );
    if (distance <= radiusInMeters) {
      usersWithinRadius.push(user);
    }
  }

  return usersWithinRadius;
}
