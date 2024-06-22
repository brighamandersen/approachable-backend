import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PROFILE_PICTURES_DIR, TEN_MB_IN_BYTES } from './constants';
import { deleteProfilePictureFile } from './utils';

const prisma = new PrismaClient();

export const profilePictureUploadConfig = multer({
  limits: {
    fileSize: TEN_MB_IN_BYTES
  },
  storage: multer.diskStorage({
    destination: PROFILE_PICTURES_DIR,
    filename: function (_req, file, cb) {
      const extension = path.extname(file.originalname);
      const filename = uuidv4() + extension; // Use random string to avoid collisions
      cb(null, filename);
    }
  })
});

const linkUserProfilePicture = async (
  req: Request<{ userId: string }>, // Comes as a string since it's a query param
  res: Response<User | string>
) => {
  const userId = parseInt(req.params.userId);
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

    if (!user) {
      res.status(404).send(`User not found with id: ${userId}`);
      return;
    }

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

export default linkUserProfilePicture;
