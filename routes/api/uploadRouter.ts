import multer from 'multer';
import {
  uploadFile,
  train,
  chatMessage,
  summarize,
  customizePrompt,
  getPrompt,
} from '../../controllers/upload.controller';
import express from 'express';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'uploads');
  },
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

// Login User
router.post('/file', uploadStorage.single('file'), uploadFile);

router.post('/train', train);

router.post('/requestMessage', chatMessage);

router.post('/summarize', summarize);

router.post('/changePrompt', customizePrompt);

router.get('/getPrompt', getPrompt);

export default router;
