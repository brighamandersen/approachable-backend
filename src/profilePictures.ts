import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { PROFILE_PICTURES_DIR } from './constants';
import multer from 'multer';

const prisma = new PrismaClient();

export const upload = multer({
  limits: {
    fileSize: 10485760 // 10 MB in bytes
  },
  storage: multer.diskStorage({
    destination: PROFILE_PICTURES_DIR,
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      const filename = 'user' + req.session.userId?.toString() + extension;
      cb(null, filename);
    }
  })
});

export const linkProfilePicture = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send('File is required');
    return;
  }

  // After the file is uploaded, update the user's profile picture link in the database
  const userId = req.session.userId;
  const uploadedFile = req.file;
  try {
    // Delete the existing profile picture if it exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        profilePicture: true
      }
    });

    if (user?.profilePicture) {
      // Delete the existing profile picture
      fs.unlinkSync(`${PROFILE_PICTURES_DIR}${user.profilePicture}`);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: uploadedFile.filename // just 'user1.png' for example
      }
    });

    res.send(updatedUser);
  } catch (error) {
    console.error('Error updating user profile picture:', error);
    res.status(500).send('Internal Server Error');
  }
};
