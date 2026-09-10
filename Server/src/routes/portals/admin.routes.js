import { Router } from 'express';
import { auth } from '#src/middlewares/auth.js';
import userRoutes from '#src/modules/users/user/user.routes.js';
import dashboardRoutes from '#src/modules/dashboard/dashboard.routes.js';
import configuracionRoutes from '#src/modules/configuration/configuracion.routes.js';

const router = Router();

// Barrera de autenticación para todo el portal
router.use(auth);

// /api/users  →  CRUD usuarios, roles, roles académicos
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/configuracion', configuracionRoutes);

export default router;