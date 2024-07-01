import express from 'express';
import multer from 'multer';
import { createCSV } from '../controllers/csvController.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/csv_files');  // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to handle CSV file upload and save
router.post('/upload', upload.single('csv'), createCSV);

export default router;
