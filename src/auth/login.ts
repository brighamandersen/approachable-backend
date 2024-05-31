import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { isSet } from '../utils';

const prisma = new PrismaClient();

const login = async (
  req: Request<
    {},
    {},
    {
      email: string;
      password: string;
    }
  >,
  res: Response<User | string>
) => {
  const { email, password } = req.body;

  if (!isSet(email) || !isSet(password)) {
    res.status(400).send('Email and password are required');
    return;
  }

  // Check if user exists in the database
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      res.status(404).send(`User not found with email: ${email}`);
      return;
    }

    if (user.password !== password) {
      res.status(401).send('Invalid password');
      return;
    }

    req.session.userId = user.id;
    res.status(200).send(user);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default login;
