import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import session from 'express-session';
import { User } from './types';
import { getCurrentTimestamp, getUsersWithinRadius, isSet } from './utils';

const PROFILE_PICTURES_DIR = 'uploads/profile-pictures/';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const PORT = process.env.PORT || 3003;
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors({ origin: `*` }));
app.use(
  session({
    secret: 'RnMUNJkDtn%7&SKoa$4EQiT^JPFs',
    resave: false,
    saveUninitialized: true
  })
);

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(401).send('Unauthorized: User is not logged in');
    return;
  }

  next();
};

const TEN_MB_IN_BYTES = 10485760;
const upload = multer({
  limits: {
    fileSize: TEN_MB_IN_BYTES
  },
  storage: multer.diskStorage({
    destination: PROFILE_PICTURES_DIR,
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      const filename = 'user' + req.session.userId?.toString() + extension;
      cb(null, filename);
    }
  })
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

app.post(
  '/login',
  async (
    req: Request<
      {},
      {},
      {
        userId: number;
      }
    >,
    res: Response
  ) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send('userId is required');
    }

    if (req.session.userId) {
      res.status(200).send(`User ${req.session.userId} is already logged in`);
      return;
    }

    // Check if user exists in the database
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) {
        res.status(404).send(`User with id ${userId} not found`);
        return;
      }
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    req.session.userId = userId;

    res.status(200).send(`User ${userId} logged in successfully`);
  }
);

app.post('/logout', (req, res) => {
  if (!req.session.userId) {
    res.status(401).send('No one was logged in');
    return;
  }

  const userId = req.session.userId;
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.status(200).send(`User ${userId} logged out successfully`);
  });
});

app.use('/profile-pictures', express.static(PROFILE_PICTURES_DIR));

app.post(
  '/profile-pictures',
  requireAuth,
  upload.single('profilePicture'),
  async (req, res) => {
    if (!req.file) {
      res.status(400).send('File is required');
      return;
    }

    // After the file is uploaded, update the user's profile picture link in the database
    const userId = req.session.userId;
    const uploadedFile = req.file;
    try {
      // Delete the existing profile picture if it exists
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          profilePicture: true
        }
      });

      if (user?.profilePicture) {
        // Delete the existing profile picture
        fs.unlinkSync(`${PROFILE_PICTURES_DIR}${user.profilePicture}`);
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          profilePicture: uploadedFile.filename // just 'user1.png' for example
        }
      });

      res.send(updatedUser);
    } catch (error) {
      console.error('Error updating user profile picture:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

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
        birthDate: number;
        bio?: string;
        latitude: number;
        longitude: number;
      }
    >,
    res: Response<User | string>
  ) => {
    const { firstName, lastName, birthDate, bio, latitude, longitude } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !bio ||
      !latitude ||
      !longitude
    ) {
      res.status(400).send('Invalid request body');
      return;
    }

    try {
      const createdUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          birthDate,
          bio,
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
 * Get users within a certain radius in meters of a certain user
 */
app.get(
  '/users/nearby',
  async (
    req: Request<{
      userId: string;
      radiusInMeters: string;
    }>,
    res: Response<User[] | string>
  ) => {
    const userId = parseInt(req.query.userId as string);
    const radiusInMeters: number = parseFloat(
      req.query.radiusInMeters as string
    );

    if (!userId || !radiusInMeters) {
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
        radiusInMeters
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
    req: Request<
      { id: string },
      {},
      {
        firstName?: string;
        lastName?: string;
        birthDate?: number;
        bio?: string | null;
        hiddenOnMap?: boolean;
        interestedInFriends?: boolean;
        interestedInDating?: boolean;
        interestedInBusiness?: boolean;
        interestedInHelp?: boolean;
        latitude?: number;
        longitude?: number;
      }
    >,
    res: Response<User | string>
  ) => {
    const userId = parseInt(req.params.id);

    const {
      firstName,
      lastName,
      birthDate,
      bio,
      hiddenOnMap,
      interestedInFriends,
      interestedInDating,
      interestedInBusiness,
      interestedInHelp,
      latitude,
      longitude
    } = req.body;

    if (
      !isSet(firstName) &&
      !isSet(lastName) &&
      !isSet(birthDate) &&
      !isSet(bio) &&
      !isSet(hiddenOnMap) &&
      !isSet(interestedInFriends) &&
      !isSet(interestedInDating) &&
      !isSet(interestedInBusiness) &&
      !isSet(interestedInHelp) &&
      !isSet(latitude) &&
      !isSet(longitude)
    ) {
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
          birthDate,
          bio,
          hiddenOnMap,
          interestedInFriends,
          interestedInDating,
          interestedInBusiness,
          interestedInHelp,
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
