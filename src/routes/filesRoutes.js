import express from 'express';
import multer from 'multer';
import { createFile,getFiles} from '../controllers/filesController.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/av_files');  // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to handle audio file upload and save
router.post('/upload', upload.single('file'), createFile);

router.get('/:id',getFiles);

export default router;
