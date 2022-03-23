import express from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import projectRoutes from './project';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/projects', projectRoutes);

export default router;
