import { Router } from 'express';
import authRoutes from './auth';
import dataRoutes from './data';
import userRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/data', dataRoutes);
router.use('/users', userRoutes);

// You can add other resource-specific routes here
// e.g. router.use('/dealers', dealerRoutes);

export default router;
