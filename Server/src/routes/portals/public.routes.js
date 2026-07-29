import { Router } from 'express';
import authRoutes from '#src/modules/users/auth/auth.routes.js';
import passwordResetRoutes from '#src/modules/password-reset/password-reset.routes.js';
import emailVerificationRoutes from '#src/modules/users/email-verification/email-verification.routes.js';

const router = Router();

// POST /api/auth/login
router.use('/auth', authRoutes);
router.use('/password-reset', passwordResetRoutes);
router.use('/email-verification', emailVerificationRoutes);

export default router;