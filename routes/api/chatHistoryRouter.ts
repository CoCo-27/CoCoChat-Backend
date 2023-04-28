import {
  getHistory,
  // deleteQuestion,
} from '../../controllers/chatHistory.controller';
import express from 'express';
const router = express.Router();

router.post('/get', getHistory);

export default router;
