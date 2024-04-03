declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: number; // Unix timestamp
  profilePicture: string | null;
  bio: string | null;
  hiddenOnMap: boolean;
  interestedInFriends: boolean;
  interestedInDating: boolean;
  interestedInBusiness: boolean;
  interestedInHelp: boolean;
  latitude: number;
  longitude: number;
  locationLastUpdated: number; // Unix timestamp
}
