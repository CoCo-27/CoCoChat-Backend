import {
  createTitle,
  getTitle,
  editTitle,
  deleteAll,
} from '../../controllers/title.controller';
import express from 'express';
const router = express.Router();

router.post('/create', createTitle);

router.get('/get', getTitle);

router.post('/edit', editTitle);

router.delete('/deleteAll', deleteAll);

export default router;
