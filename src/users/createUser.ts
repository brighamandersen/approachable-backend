import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { getCurrentTimestamp, hashPassword, isSet } from '../utils';

const prisma = new PrismaClient();

/**
 * Create a user (similar to register, except this one allows admins to create users without validation.)
 */
const createUser = async (
  req: Request<
    {},
    {},
    {
      age: number;
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
  const { age, email, firstName, lastName, latitude, longitude, password } =
    req.body;

  if (
    !isSet(age) ||
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
        age,
        email,
        firstName,
        lastName,
        latitude,
        locationLastUpdated: getCurrentTimestamp(),
        longitude,
        password: await hashPassword(password)
      }
    });

    res.status(201).send(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default createUser;
