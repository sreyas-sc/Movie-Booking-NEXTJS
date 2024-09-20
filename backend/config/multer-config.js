// import multer from 'multer';
// import path from 'path';

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// // Initialize upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 2000000 }, // Limit file size to 1MB
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|gif/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = filetypes.test(file.mimetype);
//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb('Error: Images Only!');
//         }
//     }
// }).fields([{ name: 'poster', maxCount: 1 }, { name: 'castPhotos', maxCount: 10 }]); // Adjust as needed

// export { upload };

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// import multer from '../public/uploads'

// Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure public/uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage engine to save files in the public/uploads directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save to public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed extensions
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check extension
        const mimetype = filetypes.test(file.mimetype); // Check MIME type
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images Only!'));
        }
    }
}).fields([{ name: 'poster', maxCount: 1 }, { name: 'castPhotos', maxCount: 10 }]); // Adjust as needed

export { upload };
