import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

interface User {
  id: number;
  firstName: string;
  lastName: string;
  // email: string;
  // password: string;
}

interface UserLocation {
  userId: number;
  latitude: number;
  longitude: number;
}

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello world');
});

app.get(
  '/get-user-locations',
  async (req: Request, res: Response<UserLocation[]>) => {
    console.log('Hello world');
    const userLocations: UserLocation[] = [
      {
        userId: 1,
        latitude: 40.7128,
        longitude: -74.006
      },
      {
        userId: 2,
        latitude: 34.0522,
        longitude: -118.2437
      }
    ];
    res.send(userLocations);
  }
);

app.listen(PORT, (): void => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
