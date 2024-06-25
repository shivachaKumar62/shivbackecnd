import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadVideo } from '../controllers/videoController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('video_url'), uploadVideo);

export default router;
