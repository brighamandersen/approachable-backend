import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { User } from './types';
import { getCurrentTimestamp, getUsersWithinRadius } from './utils';
import { Feet } from './types';

const PORT = process.env.PORT || 3003;
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors({ origin: `*` }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

/**
 * Create a user
 */
app.post(
  '/users',
  async (
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

    try {
      const createdUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          latitude,
          longitude,
          locationLastUpdated: getCurrentTimestamp()
        }
      });

      res.status(201).send(createdUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

/**
 * Get all users
 */
app.get('/users', async (_req: Request, res: Response<User[] | string>) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.send(allUsers);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Get users within a certain radius in feet of a certain user
 */
app.get(
  '/users/nearby',
  async (
    req: Request<{
      userId: string;
      radiusInFeet: string;
    }>,
    res: Response<User[] | string>
  ) => {
    const userId = parseInt(req.query.userId as string);
    const radiusInFeet: Feet = parseFloat(req.query.radiusInFeet as string);

    if (!userId || !radiusInFeet) {
      res.status(400).send('Invalid query parameters');
      return;
    }

    try {
      const targetUser = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });
      if (!targetUser) {
        res.status(404).send('User not found');
        return;
      }

      const allUsersButTargetUser = await prisma.user.findMany({
        where: {
          id: {
            not: userId
          }
        }
      });

      const usersNearby = getUsersWithinRadius(
        allUsersButTargetUser,
        targetUser.latitude,
        targetUser.longitude,
        radiusInFeet
      );
      res.send(usersNearby);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

/**
 * Get user by id
 */
app.get(
  '/users/:id',
  async (req: Request<{ id: string }>, res: Response<User | string>) => {
    const userId = parseInt(req.params.id);

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      res.send(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

/**
 * Update a user by id
 */
app.put(
  '/users/:id',
  async (
    req: Request<{ id: string }, {}, Partial<User>>,
    res: Response<User | string>
  ) => {
    const userId = parseInt(req.params.id);
    const { firstName, lastName, bio, latitude, longitude } = req.body;

    if (!firstName && !lastName && !bio && !latitude && !longitude) {
      res.status(400).send('Invalid request body');
      return;
    }

    const didUpdateLocation = latitude || longitude;

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          firstName,
          lastName,
          bio,
          latitude,
          longitude,
          locationLastUpdated: didUpdateLocation
            ? getCurrentTimestamp()
            : undefined
        }
      });

      if (!updatedUser) {
        res.status(404).send('User not found');
        return;
      }

      res.send(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

/**
 * Delete user by id
 */
app.delete(
  '/users/:id',
  async (req: Request<{ id: string }>, res: Response<string>) => {
    const userId = parseInt(req.params.id);

    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId
        }
      });

      if (!deletedUser) {
        res.status(404).send('User not found');
        return;
      }

      res.status(204).send(); // No content (user was deleted)
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
