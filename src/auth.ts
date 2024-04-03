import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // FIXME: Maybe handle database logic in different spot eventually

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.userId) {
    res.status(401).send('Unauthorized: User is not logged in');
    return;
  }

  next();
};

export const login = async (
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

export const logout = (req: Request, res: Response) => {
  if (!req.session?.userId) {
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
};
