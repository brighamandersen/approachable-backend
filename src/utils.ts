import { User } from '@prisma/client';
import { Feet, UnixTimestamp } from './types';

export function getCurrentTimestamp(): UnixTimestamp {
  return Math.floor(Date.now() / 1000);
}

// function calculateDistanceInFeet(
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): Feet {
//   const feetPerDegreeLat = 364000; // Approximately feet per degree latitude
//   const feetPerDegreeLon = 288200; // Approximately feet per degree longitude

//   const deltaX = (lon2 - lon1) * feetPerDegreeLon;
//   const deltaY = (lat2 - lat1) * feetPerDegreeLat;

//   // Calculate distance using Pythagorean theorem
//   const distanceInFeet = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
//   return distanceInFeet;
// }

// function getUsersWithinRadius(
//   allUsers: User[],
//   latitude: number,
//   longitude: number,
//   radius: Feet
// ): User[] {
//   const usersWithinRadius: User[] = [];

//   // Iterate through each user and check if they are within the radius
//   for (const user of allUsers) {
//     const distance = calculateDistanceInFeet(
//       latitude,
//       longitude,
//       user.latitude,
//       user.longitude
//     );
//     if (distance <= radius) {
//       usersWithinRadius.push(user);
//     }
//   }

//   return usersWithinRadius;
// }

// export function getUsersWithinSquareFootDistance(
//   allUsers: User[],
//   latitude: number,
//   longitude: number,
//   squareFeet: number
// ): User[] {
//   const radius = Math.sqrt(squareDistance);
//   return getUsersWithinRadius(allUsers, latitude, longitude, radius);
// }
