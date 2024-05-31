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
      birthDate: string;
      email: string;
      firstName: string;
      lastName: string;
      latitude: number;
      longitude: number;
      password: string;
    }
  >,
  res: Response<User | string>
) => {
  const {
    birthDate,
    email,
    firstName,
    lastName,
    latitude,
    longitude,
    password
  } = req.body;

  if (
    !isSet(birthDate) ||
    !isSet(email) ||
    !isSet(firstName) ||
    !isSet(lastName) ||
    !isSet(latitude) ||
    !isSet(longitude) ||
    !isSet(password)
  ) {
    res.status(400).send('Invalid request body');
    return;
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        birthDate,
        email,
        firstName,
        lastName,
        latitude,
        locationLastUpdated: getCurrentTimestamp(),
        longitude,
        password
      }
    });

    res.status(201).send(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default createUser;
