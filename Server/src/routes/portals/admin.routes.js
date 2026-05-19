import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import userRoutes from '../../modules/users/user/user.routes.js';

const router = Router();

// Barrera de autenticación para todo el portal
router.use(auth);

// /api/users  →  CRUD usuarios, roles, roles académicos
router.use('/users', userRoutes);

export default router;