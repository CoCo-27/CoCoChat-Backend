import {
  uploadFile,
  train,
  chatMessage,
} from '../../controllers/upload.controller';
import uploadMiddleware from '../../middleware/upload';
import express from 'express';
const router = express.Router();

// Login User
router.post('/file', uploadMiddleware.upload, uploadFile);

router.post('/train', train);

router.post('/requestMessage', chatMessage);

export default router;
