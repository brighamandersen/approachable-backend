export type UnixTimestamp = number;

export type Meters = number;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: UnixTimestamp;
  bio: string | null;
  interestedInFriends: boolean;
  interestedInDating: boolean;
  interestingInBusiness: boolean;
  interestedInHelp: boolean;
  latitude: number;
  longitude: number;
  locationLastUpdated: UnixTimestamp;
}
