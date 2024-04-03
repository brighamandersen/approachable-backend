import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types';
import { getCurrentTimestamp } from '../utils';

const prisma = new PrismaClient();

/**
 * Create a user
 */
const createUser = async (
  req: Request<
    {},
    {},
    {
      firstName: string;
      lastName: string;
      birthDate: number;
      bio?: string;
      latitude: number;
      longitude: number;
    }
  >,
  res: Response<User | string>
) => {
  const { firstName, lastName, birthDate, bio, latitude, longitude } = req.body;

  if (
    !firstName ||
    !lastName ||
    !birthDate ||
    !bio ||
    !latitude ||
    !longitude
  ) {
    res.status(400).send('Invalid request body');
    return;
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        birthDate,
        bio,
        latitude,
        longitude,
        locationLastUpdated: getCurrentTimestamp()
      }
    });

    res.status(201).send(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default createUser;
