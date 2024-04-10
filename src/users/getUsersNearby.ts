import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { filterByUsersWithinRadius, isSet } from '../utils';

const prisma = new PrismaClient();

/**
 * Get users within a certain radius in meters of a certain user
 */
const getUsersNearby = async (
  req: Request<{
    userId: string;
    radiusInMeters: string;
  }>,
  res: Response<User[] | string>
) => {
  const userId = parseInt(req.query.userId as string);
  const radiusInMeters: number = parseFloat(req.query.radiusInMeters as string);

  if (!isSet(userId) || !isSet(radiusInMeters)) {
    res.status(400).send('Invalid query parameters');
    return;
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (!targetUser) {
      res.status(404).send('User not found');
      return;
    }

    const allUsersButTargetUser = await prisma.user.findMany({
      where: {
        id: {
          not: userId
        }
      }
    });

    const usersNearby = filterByUsersWithinRadius(
      allUsersButTargetUser,
      targetUser.latitude,
      targetUser.longitude,
      radiusInMeters
    );
    res.send(usersNearby);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default getUsersNearby;
