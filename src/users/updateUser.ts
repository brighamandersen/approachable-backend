import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '../types';
import { getCurrentTimestamp, isSet } from '../utils';

const prisma = new PrismaClient();

/**
 * Update a user by id
 */
const updateUser = async (
  req: Request<
    { id: string },
    {},
    {
      firstName?: string;
      lastName?: string;
      birthDate?: number;
      bio?: string | null;
      hiddenOnMap?: boolean;
      interestedInFriends?: boolean;
      interestedInDating?: boolean;
      interestedInBusiness?: boolean;
      interestedInHelp?: boolean;
      latitude?: number;
      longitude?: number;
    }
  >,
  res: Response<User | string>
) => {
  const userId = parseInt(req.params.id);

  const {
    firstName,
    lastName,
    birthDate,
    bio,
    hiddenOnMap,
    interestedInFriends,
    interestedInDating,
    interestedInBusiness,
    interestedInHelp,
    latitude,
    longitude
  } = req.body;

  if (
    !isSet(firstName) &&
    !isSet(lastName) &&
    !isSet(birthDate) &&
    !isSet(bio) &&
    !isSet(hiddenOnMap) &&
    !isSet(interestedInFriends) &&
    !isSet(interestedInDating) &&
    !isSet(interestedInBusiness) &&
    !isSet(interestedInHelp) &&
    !isSet(latitude) &&
    !isSet(longitude)
  ) {
    res.status(400).send('Invalid request body');
    return;
  }

  const didUpdateLocation = latitude || longitude;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        firstName,
        lastName,
        birthDate,
        bio,
        hiddenOnMap,
        interestedInFriends,
        interestedInDating,
        interestedInBusiness,
        interestedInHelp,
        latitude,
        longitude,
        locationLastUpdated: didUpdateLocation
          ? getCurrentTimestamp()
          : undefined
      }
    });

    if (!updatedUser) {
      res.status(404).send('User not found');
      return;
    }

    res.send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default updateUser;
