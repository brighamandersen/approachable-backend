import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const login = async (
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

  if (req.session?.userId) {
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
};

export default login;
