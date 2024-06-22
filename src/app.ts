import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
import { ONE_WEEK_IN_MILLISECONDS, PROFILE_PICTURES_DIR } from './constants';
import register from './auth/register';
import login from './auth/login';
import logout from './auth/logout';
import linkProfilePicture from './profilePictures/linkProfilePicture';
import uploadConfig from './profilePictures/uploadConfig';
import createUser from './users/createUser';
import getAllUsers from './users/getAllUsers';
import getUsersNearby from './users/getUsersNearby';
import updateUser from './users/updateUser';
import getUserById from './users/getUser';
import deleteUser from './users/deleteUser';
import requireAuth from './auth/requireAuth';
import './types'; // Must import this so it uses custom express-session SessionData
import { PrismaClient } from '@prisma/client';
import getUserProfilePicture from './getUserProfilePicture';

dotenv.config();

if (!process.env.SESSION_KEY) {
  console.error(
    'SESSION_KEY environment variable is not set. Please provide a value for SESSION_KEY in .env file.'
  );
  process.exit(1);
}

const PORT = process.env.PORT || 3003;
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(
  session({
    cookie: {
      maxAge: ONE_WEEK_IN_MILLISECONDS
    },
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
  })
);

const prisma = new PrismaClient();

app.post('/register', register);
app.post('/login', login);
app.post('/logout', requireAuth, logout);

app.get('/users/:userId/profile-picture', requireAuth, getUserProfilePicture);

app.post(
  '/users/:userId/profile-picture',
  requireAuth,
  uploadConfig.single('profilePicture'),
  linkProfilePicture
);

app.get('/users/nearby', requireAuth, getUsersNearby);
app.get('/users/:id', requireAuth, getUserById);
app.put('/users/:id', requireAuth, updateUser);
app.delete('/users/:id', requireAuth, deleteUser);
app.get('/users', requireAuth, getAllUsers);
app.post('/users', requireAuth, createUser);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
