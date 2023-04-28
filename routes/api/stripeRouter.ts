import {
  payment,
  // deleteQuestion,
} from '../../controllers/stripeRouter.controller';
import express from 'express';
const router = express.Router();

router.post('/webhooks', payment);

export default router;
