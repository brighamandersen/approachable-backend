import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { getCurrentTimestamp, isSet } from '../utils';

const prisma = new PrismaClient();

/**
 * Create a user
 */
const createUser = async (
  req: Request<
    {},
    {},
    {
      birthDate: number;
      firstName: string;
      lastName: string;
      latitude: number;
      longitude: number;
    }
  >,
  res: Response<User | string>
) => {
  const { birthDate, firstName, lastName, latitude, longitude } = req.body;

  if (
    !isSet(birthDate) ||
    !isSet(firstName) ||
    !isSet(lastName) ||
    !isSet(latitude) ||
    !isSet(longitude)
  ) {
    res.status(400).send('Invalid request body');
    return;
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        birthDate,
        firstName,
        lastName,
        latitude,
        locationLastUpdated: getCurrentTimestamp(),
        longitude
      }
    });

    res.status(201).send(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default createUser;
