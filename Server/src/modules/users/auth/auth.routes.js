import { Router } from 'express';
import { login, refresh, logout, issueSSETicket } from './auth.controller.js';
import { auth }         from '../../../middlewares/auth.js';
import { loginLimiter } from '../../../middlewares/rateLimiter.js';

const router = Router();

// POST /api/auth/login
router.post('/login',      loginLimiter, login);
router.post('/refresh',    refresh);
router.post('/logout',     auth, logout);
router.post('/sse-ticket', auth, issueSSETicket);

export default router;