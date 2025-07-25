import { Router } from 'express';
import authRoutes from './auth';
import dataRoutes from './data';
import userRoutes from './users';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleActionGuard } from '../middleware/roleActionGuard';

const router = Router();

router.use('/auth', authRoutes);
router.use('/data', authMiddleware, roleActionGuard, dataRoutes);
router.use('/users', authMiddleware, roleActionGuard, userRoutes);

// You can add other resource-specific routes here
// e.g. router.use('/dealers', dealerRoutes);

export default router;
