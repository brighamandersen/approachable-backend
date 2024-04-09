import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { ONE_WEEK_IN_MILLISECONDS, PROFILE_PICTURES_DIR } from './constants';
import login from './auth/login';
import logout from './auth/logout';
import requireAuth from './auth/requireAuth';
import linkProfilePicture from './profilePictures/linkProfilePicture';
import uploadConfig from './profilePictures/uploadConfig';
import createUser from './users/createUser';
import getAllUsers from './users/getAllUsers';
import getUsersNearby from './users/getUsersNearby';
import updateUser from './users/updateUser';
import getUserById from './users/getUser';
import deleteUser from './users/deleteUser';
import sessionConfig from './auth/sessionConfig';

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
app.use(cors({ origin: `*` }));
app.use(session(sessionConfig));

app.post('/login', login);
app.post('/logout', logout);

app.use('/profile-pictures', express.static(PROFILE_PICTURES_DIR));
app.post(
  '/profile-pictures',
  requireAuth,
  uploadConfig.single('profilePicture'),
  linkProfilePicture
);

app.get('/users/nearby', getUsersNearby);
app.get('/users/:id', getUserById);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
app.get('/users', getAllUsers);
app.post('/users', createUser);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
