import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { UserLocation } from './models';

const app = express();
app.use(express.json());
const PORT = 3000;

const db = new sqlite3.Database('db.sqlite3');

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello world');
});

app.get(
  '/get-user-locations',
  async (_req: Request, res: Response<UserLocation[] | string>) => {
    db.all('SELECT * FROM UserLocation', (err, rows: UserLocation[]) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.send(rows);
    });
  }
);

app.listen(PORT, (): void => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
