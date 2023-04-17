import {
  uploadFile,
  train,
  chatMessage,
  summarize,
  customizePrompt,
  getPrompt,
} from '../../controllers/upload.controller';
import uploadMiddleware from '../../middleware/upload';
import express from 'express';
const router = express.Router();

// Login User
router.post('/file', uploadMiddleware.upload, uploadFile);

router.post('/train', train);

router.post('/requestMessage', chatMessage);

router.post('/summarize', summarize);

router.post('/changePrompt', customizePrompt);

router.get('/getPrompt', getPrompt);

export default router;
