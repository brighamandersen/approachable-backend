import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { getCurrentTimestamp, isSet } from '../utils';

const prisma = new PrismaClient();

/**
 * Register a user (similar to createUser, except this one is for even non-admins to create a user, so there's extra validation.)
 */
const register = async (
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
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (userWithSameEmail) {
      res.status(409).send('Email already exists');
      return;
    }

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

    req.session.userId = createdUser.id;
    res.status(201).send(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default register;
