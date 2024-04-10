import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { deleteProfilePictureFile } from '../utils';

const prisma = new PrismaClient();

const linkProfilePicture = async (
  req: Request<
    {},
    {},
    {
      userId: string; // Comes as a string since it's form data and not the body
    }
  >,
  res: Response<User | string>
) => {
  const userId = parseInt(req.body.userId);
  const uploadedFile = req.file;

  if (!uploadedFile) {
    res.status(400).send('File is required');
    return;
  }

  try {
    // Delete the existing profile picture if it exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    deleteProfilePictureFile(user?.profilePicture);

    // Update the user's profile picture link in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: uploadedFile.filename // Save the filename of the uploaded file
      }
    });

    res.send(updatedUser);
  } catch (error) {
    console.error('Error updating user profile picture:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default linkProfilePicture;
