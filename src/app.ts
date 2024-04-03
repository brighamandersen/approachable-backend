import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import { PROFILE_PICTURES_DIR } from './constants';
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

const PORT = process.env.PORT || 3003;
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

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Approachable API!');
});

app.post('/login', login);
app.post('/logout', logout);

app.use('/profile-pictures', express.static(PROFILE_PICTURES_DIR));
app.post(
  '/profile-pictures',
  requireAuth,
  uploadConfig.single('profilePicture'),
  linkProfilePicture
);

app.post('/users', createUser);
app.get('/users', getAllUsers);
app.get('/users/:id', getUserById);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
app.get('/users/nearby', getUsersNearby);

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
