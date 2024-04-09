import multer from 'multer';
import path from 'path';
import { PROFILE_PICTURES_DIR, TEN_MB_IN_BYTES } from '../constants';

const uploadConfig = multer({
  limits: {
    fileSize: TEN_MB_IN_BYTES
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

export default uploadConfig;
