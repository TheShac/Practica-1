import { Router } from 'express';
import { login, refresh, logout, issueSSETicket, googleAuth, googleCallback, me } from './auth.controller.js';
import { auth }         from '../../../middlewares/auth.js';
import { loginLimiter } from '../../../middlewares/rateLimiter.js';

const router = Router();

// POST /api/auth/login
router.post('/login',          loginLimiter, login);
router.post('/refresh',        refresh);
router.get('/google',          googleAuth);
router.get('/google/callback', googleCallback);
router.get('/me',              auth, me);
router.post('/logout',         auth, logout);
router.post('/sse-ticket',     auth, issueSSETicket);

export default router;