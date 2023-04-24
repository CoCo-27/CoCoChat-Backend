import {
  createQuestion,
  deleteAll,
  getQuestion,
  editQuestion,
  // deleteQuestion,
} from '../../controllers/question.controller';
import express from 'express';
const router = express.Router();

router.post('/create', createQuestion);

router.get('/get', getQuestion);

router.post('/edit', editQuestion);

// router.post('/delete', deleteQuestion);
router.delete('/deleteAll', deleteAll);

export default router;
