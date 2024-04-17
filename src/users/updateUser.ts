import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
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
      bio?: string | null;
      birthDate?: string;
      firstName?: string;
      hiddenOnMap?: boolean;
      interestedInBusiness?: boolean;
      interestedInDating?: boolean;
      interestedInFriends?: boolean;
      interestedInHelp?: boolean;
      lastName?: string;
      latitude?: number;
      longitude?: number;
    }
  >,
  res: Response<User | string>
) => {
  const userId = parseInt(req.params.id);

  const {
    bio,
    birthDate,
    firstName,
    hiddenOnMap,
    interestedInBusiness,
    interestedInDating,
    interestedInFriends,
    interestedInHelp,
    lastName,
    latitude,
    longitude
  } = req.body;

  if (
    !isSet(bio) &&
    !isSet(birthDate) &&
    !isSet(firstName) &&
    !isSet(hiddenOnMap) &&
    !isSet(interestedInBusiness) &&
    !isSet(interestedInDating) &&
    !isSet(interestedInFriends) &&
    !isSet(interestedInHelp) &&
    !isSet(lastName) &&
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
        bio,
        birthDate,
        firstName,
        hiddenOnMap,
        interestedInBusiness,
        interestedInDating,
        interestedInFriends,
        interestedInHelp,
        lastName,
        latitude,
        locationLastUpdated: didUpdateLocation
          ? getCurrentTimestamp()
          : undefined,
        longitude
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
