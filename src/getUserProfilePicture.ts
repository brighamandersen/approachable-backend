import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { PrismaClient, User } from '@prisma/client';
import { PROFILE_PICTURES_DIR } from './constants';

const prisma = new PrismaClient();

const getUserProfilePicture = async (
  req: Request<{ userId: string }>, // Comes as a string since it's a query param
  res: Response<User | string>
) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user?.profilePicture) {
      res.status(404).send('User or profile picture not found');
      return;
    }

    const filePath = path.join(PROFILE_PICTURES_DIR, user.profilePicture);
    if (!fs.existsSync(filePath)) {
      res.status(404).send('Profile picture not found');
      return;
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Error getting user profile picture:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default getUserProfilePicture;
