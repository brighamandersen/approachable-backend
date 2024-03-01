import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { User, UserLocation } from './models';

const app = express();
app.use(express.json());
const PORT = 3000;

const db = new sqlite3.Database('db.sqlite3');

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

// User endpoints

app.get('/users/:id', (req: Request, res: Response<User | string>) => {
  const userId = req.params.id;

  db.get('SELECT * FROM USER where id = ?', [userId], (err, user: User) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    res.send(user);
  });
});

// User location endpoints

app.get(
  '/user-locations',
  (_req: Request, res: Response<UserLocation[] | string>) => {
    db.all(
      'SELECT * FROM UserLocation',
      (err, userLocations: UserLocation[]) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        res.send(userLocations);
      }
    );
  }
);

app.get(
  '/user-locations/:userId',
  (req: Request, res: Response<UserLocation | string>) => {
    const userId = req.params.userId;

    db.get(
      'SELECT * FROM UserLocation WHERE userId = ?',
      [userId],
      (err, userLocation: UserLocation) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        if (!userLocation) {
          res.status(404).send('User location not found');
          return;
        }

        res.send(userLocation);
      }
    );
  }
);

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
