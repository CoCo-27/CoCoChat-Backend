import express from 'express';
import userRouter from './api/userRouter';
import uploadRouter from './api/uploadRouter';
import questionRouter from './api/questionRouter';
import titleRouter from './api/titleRouter';
import chatHistoryRouter from './api/chatHistoryRouter';
import stripeRouter from './api/stripeRouter';
const router = express.Router();

router.use('/user', userRouter);
router.use('/upload', uploadRouter);
router.use('/question', questionRouter);
router.use('/title', titleRouter);
router.use('/history', chatHistoryRouter);
router.use('/stripe', stripeRouter);

export default router;
