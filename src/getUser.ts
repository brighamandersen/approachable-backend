import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user by id
 */
const getUser = async (
  req: Request<{ id: string }>,
  res: Response<User | string>
) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    res.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default getUser;
