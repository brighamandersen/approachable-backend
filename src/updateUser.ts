import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { getCurrentTimestamp, isSet } from './utils';

const prisma = new PrismaClient();

/**
 * Update a user by id
 */
const updateUser = async (
  req: Request<
    { id: string },
    {},
    {
      age?: number;
      bio?: string | null;
      email?: string;
      firstName?: string;
      interestedInBusiness?: boolean;
      interestedInDating?: boolean;
      interestedInFriends?: boolean;
      interestedInHelp?: boolean;
      lastName?: string;
      latitude?: number;
      longitude?: number;
      visible?: boolean;
    }
  >,
  res: Response<User | string>
) => {
  const userId = parseInt(req.params.id);

  const {
    age,
    bio,
    email,
    firstName,
    interestedInBusiness,
    interestedInDating,
    interestedInFriends,
    interestedInHelp,
    lastName,
    latitude,
    longitude,
    visible
  } = req.body;

  if (
    !isSet(age) &&
    !isSet(bio) &&
    !isSet(email) &&
    !isSet(firstName) &&
    !isSet(interestedInBusiness) &&
    !isSet(interestedInDating) &&
    !isSet(interestedInFriends) &&
    !isSet(interestedInHelp) &&
    !isSet(lastName) &&
    !isSet(latitude) &&
    !isSet(longitude) &&
    !isSet(visible)
  ) {
    res.status(400).send('Invalid request body');
    return;
  }

  const didUpdateLocation = latitude || longitude;

  const userToUpdate = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!userToUpdate) {
    res.status(404).send('User not found');
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        age,
        bio,
        email,
        firstName,
        interestedInBusiness,
        interestedInDating,
        interestedInFriends,
        interestedInHelp,
        lastName,
        latitude,
        locationLastUpdated: didUpdateLocation
          ? getCurrentTimestamp()
          : undefined,
        longitude,
        visible
      }
    });

    res.send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default updateUser;
