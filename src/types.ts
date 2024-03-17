export type UnixTimestamp = number;

export type Meters = number;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  bio: string | null;
  latitude: number;
  longitude: number;
  locationLastUpdated: UnixTimestamp;
}
