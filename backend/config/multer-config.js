
import multer from 'multer';
import path from 'path';

// Define storage and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = '';

    if (file.fieldname === 'poster' || file.fieldname === 'banner') {
      folder = path.join(__dirname, '../uploads/movies');
    } else if (file.fieldname === 'castPhotos') {
      folder = path.join(__dirname, '../uploads/cast');
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
}) // Allow up to 10 cast photos

