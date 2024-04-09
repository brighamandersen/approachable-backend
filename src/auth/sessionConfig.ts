import { ONE_WEEK_IN_MILLISECONDS } from '../constants';

const sessionConfig = {
  cookie: {
    maxAge: ONE_WEEK_IN_MILLISECONDS
  },
  secret: process.env.SESSION_KEY as string,
  resave: false,
  saveUninitialized: true
};

export default sessionConfig;
