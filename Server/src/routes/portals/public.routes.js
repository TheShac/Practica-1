import { Router } from 'express';
import authRoutes from '../../modules/users/auth/auth.routes.js';

const router = Router();

// POST /api/auth/login
router.use('/auth', authRoutes);

export default router;