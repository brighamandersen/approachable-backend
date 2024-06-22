import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all users
 */
const getAllUsers = async (_req: Request, res: Response<User[] | string>) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.send(allUsers);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default getAllUsers;
