import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { ONE_WEEK_IN_MILLISECONDS } from './constants';
import register from './register';
import login from './login';
import logout from './logout';
import linkUserProfilePicture, {
  profilePictureUploadConfig
} from './linkUserProfilePicture';
import getUserProfilePicture from './getUserProfilePicture';
import createUser from './createUser';
import getAllUsers from './getAllUsers';
import getUsersNearby from './getUsersNearby';
import updateUser from './updateUser';
import getUserById from './getUser';
import deleteUser from './deleteUser';
import requireAuth from './requireAuth';
import './types'; // Must import this so it uses custom express-session SessionData

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

app.post('/register', register);
app.post('/login', login);
app.post('/logout', requireAuth, logout);

app.get('/users/:userId/profile-picture', requireAuth, getUserProfilePicture);
app.post(
  '/users/:userId/profile-picture',
  requireAuth,
  profilePictureUploadConfig.single('profilePicture'),
  linkUserProfilePicture
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
