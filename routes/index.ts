import express from 'express';
import userRouter from './api/userRouter';
import uploadRouter from './api/uploadRouter';
const router = express.Router();

router.use('/user', userRouter);
router.use('/upload', uploadRouter);

export default router;
