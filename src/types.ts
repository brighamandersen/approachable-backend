export type UnixTimestamp = number;

export type Meters = number;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: UnixTimestamp;
  profilePictureUrl: string | null;
  bio: string | null;
  hiddenOnMap: boolean;
  interestedInFriends: boolean;
  interestedInDating: boolean;
  interestedInBusiness: boolean;
  interestedInHelp: boolean;
  latitude: number;
  longitude: number;
  locationLastUpdated: UnixTimestamp;
}
