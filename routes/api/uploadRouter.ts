import {
  uploadFile,
  train,
  chatMessage,
  summarize,
} from '../../controllers/upload.controller';
import uploadMiddleware from '../../middleware/upload';
import express from 'express';
const router = express.Router();

// Login User
router.post('/file', uploadMiddleware.upload, uploadFile);

router.post('/train', train);

router.post('/requestMessage', chatMessage);

router.post('/summarize', summarize);

export default router;
