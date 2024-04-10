import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types';

const prisma = new PrismaClient();

const login = async (
  req: Request<
    {},
    {},
    {
      userId: number;
    }
  >,
  res: Response<User | string>
) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).send('userId is required');
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

    req.session.userId = userId;
    res.status(200).send(user);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default login;
