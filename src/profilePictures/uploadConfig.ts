import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PROFILE_PICTURES_DIR, TEN_MB_IN_BYTES } from '../constants';

const uploadConfig = multer({
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

export default uploadConfig;
