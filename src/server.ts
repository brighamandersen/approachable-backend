import express, { Request, Response } from 'express';
import db from './db';
import { User } from './models';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

/**
 * Create a user
 */
app.post(
  '/users',
  (
    req: Request<
      {},
      {},
      {
        firstName: string;
        lastName: string;
        latitude: number;
        longitude: number;
      }
    >,
    res: Response<User | string>
  ) => {
    const { firstName, lastName, latitude, longitude } = req.body;

    if (!firstName || !lastName || !latitude || !longitude) {
      res.status(400).send('Invalid request body');
      return;
    }

    db.run(
      'INSERT INTO User (firstName, lastName, latitude, longitude) VALUES (?, ?, ?, ?)',
      [firstName, lastName, latitude, longitude],
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

/**
 * Get all users
 */
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

// app.get('/users-in-radius', (req, res) => {
//   // Args: Latitude, longitude, radius
// });

/**
 * Get user by id
 */
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

/**
 * Update a user by id
 */
app.put(
  '/users:id',
  (
    req: Request<{ id: string }, {}, Partial<User>>,
    res: Response<User | string>
  ) => {
    const userId = req.params.id;
    const { firstName, lastName, latitude, longitude } = req.body;

    if (!firstName && !lastName && !latitude && !longitude) {
      res.status(400).send('Invalid request body');
      return;
    }

    const queryParams: any[] = [];
    let query = 'UPDATE User SET ';
    if (firstName) {
      query += 'firstName = ?, ';
      queryParams.push(firstName);
    }
    if (lastName) {
      query += 'lastName = ?, ';
      queryParams.push(lastName);
    }
    if (latitude !== undefined) {
      query += 'latitude = ?, locationLastUpdated = ?, ';
      queryParams.push(latitude, Date.now());
    }
    if (longitude !== undefined) {
      query += 'longitude = ?, locationLastUpdated = ?, ';
      queryParams.push(longitude, Date.now());
    }
    // Remove trailing comma and space
    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    queryParams.push(userId);

    db.run(query, queryParams, function (err) {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
      }

      const noRowsAffected = this.changes === 0;
      if (noRowsAffected) {
        return res.status(404).send('User not found');
      }

      db.get('SELECT * FROM User WHERE id = ?', [userId], (err, user: User) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.send(user);
      });
    });
  }
);

/**
 * Delete user by id
 */
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

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
