import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { User, UserLocation } from './models';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('db.sqlite3');

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

// User endpoints

app.post(
  '/users',
  (
    req: Request<{}, {}, { firstName: string; lastName: string }>,
    res: Response<User | string>
  ) => {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      res.status(400).send('Invalid request body');
      return;
    }

    db.run(
      'INSERT INTO User (firstName, lastName) VALUES (?, ?)',
      [firstName, lastName],
      function (err) {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        db.get(
          'SELECT * FROM User WHERE id = ?',
          [this.lastID], // this.lastID is a special property for the last inserted row id
          (err, user: User) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Internal Server Error');
              return;
            }
            res.status(201).send(user);
          }
        );
      }
    );
  }
);

app.get('/users', (_req: Request, res: Response<User[] | string>) => {
  db.all('SELECT * FROM User', (err, users: User[]) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send(users);
  });
});

app.get(
  '/users/:id',
  (req: Request<{ id: string }>, res: Response<User | string>) => {
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
  }
);

app.delete(
  '/users/:id',
  (req: Request<{ id: string }>, res: Response<string>) => {
    const userId = req.params.id;

    db.run('DELETE FROM User WHERE id = ?', [userId], function (err) {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
      }

      const noRowsAffected = this.changes === 0;
      if (noRowsAffected) {
        return res.status(404).send('User not found');
      }

      res.status(204).send(); // No content (user was deleted)
    });
  }
);

// User location endpoints

app.post(
  '/user-locations',
  (
    req: Request<{}, {}, UserLocation>,
    res: Response<UserLocation | string>
  ) => {
    const newUserLocation: UserLocation = req.body;

    if (
      !newUserLocation ||
      !newUserLocation.userId ||
      !newUserLocation.latitude ||
      !newUserLocation.longitude
    ) {
      res.status(400).send('Invalid request body');
      return;
    }

    db.run(
      'INSERT INTO UserLocation (userId, latitude, longitude) VALUES (?, ?, ?)',
      [
        newUserLocation.userId,
        newUserLocation.latitude,
        newUserLocation.longitude
      ],
      (err) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        db.get(
          'SELECT * FROM UserLocation WHERE userId = ?',
          [newUserLocation.userId],
          (err, userLocation: UserLocation) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Internal Server Error');
              return;
            }

            res.status(201).send(userLocation);
          }
        );
      }
    );
  }
);

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
  (req: Request<{ userId: string }>, res: Response<UserLocation | string>) => {
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

app.delete(
  '/user-locations/:userId',
  (req: Request<{ id: string }>, res: Response<string>) => {
    const userId = req.params.id;

    db.run('DELETE FROM User WHERE id = ?', [userId], function (err) {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
      }

      const noRowsAffected = this.changes === 0;
      if (noRowsAffected) {
        return res.status(404).send('User not found');
      }

      res.status(204).send(); // No content (user was deleted)
    });
  }
);

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
