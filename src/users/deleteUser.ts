import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { deleteProfilePictureFile } from '../utils';

const prisma = new PrismaClient();

/**
 * Delete user by id
 */
const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response<string>
) => {
  const userId = parseInt(req.params.id);

  const userToDelete = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!userToDelete) {
    res.status(404).send('User not found');
    return;
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    });

    deleteProfilePictureFile(deletedUser?.profilePicture);

    res.status(200).send(`User ${userId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default deleteUser;
