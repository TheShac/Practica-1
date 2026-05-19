import { Router }               from 'express';
import { auth, authorizeRoles } from '../../../middlewares/auth.js';
import { getActualizaciones }   from './dashboard.controller.js';

const router = Router();

// GET /api/home-profesional/actualizaciones
router.get('/actualizaciones', auth, authorizeRoles('Secretaria'), getActualizaciones);

export default router;