import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Delete user by id
 */
const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response<string>
) => {
  const userId = parseInt(req.params.id);

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    });

    if (!deletedUser) {
      res.status(404).send('User not found');
      return;
    }

    res.status(200).send(`User ${userId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default deleteUser;
