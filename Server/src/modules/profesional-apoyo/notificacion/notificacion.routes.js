import { Router }               from 'express';
import { auth, authSSE, authorizeRoles } from '../../../middlewares/auth.js';
import {
  enviarNotificacion, listarEnviadas, eliminarNotificacion,
  misNotificaciones, marcarNotificacionLeida, contarNoLeidas, streamNotificaciones,
} from './notificacion.controller.js';

const router = Router();
const sec    = [auth, authorizeRoles('Secretaria')];

// ── Rutas fijas antes de dinámicas ────────────────────────────────────────
// GET  /api/notificaciones/enviadas
// GET  /api/notificaciones/mis
// GET  /api/notificaciones/no-leidas
router.get('/enviadas',   ...sec,  listarEnviadas);
router.get('/mis',        auth,    misNotificaciones);
router.get('/no-leidas',  auth,    contarNoLeidas);
router.get('/stream',     authSSE, streamNotificaciones);

// ── Rutas dinámicas ───────────────────────────────────────────────────────
// POST   /api/notificaciones
// DELETE /api/notificaciones/:id
// PUT    /api/notificaciones/:id/leida
router.post(   '/',          ...sec, enviarNotificacion);
router.delete( '/:id',       ...sec, eliminarNotificacion);
router.put(    '/:id/leida', auth,   marcarNotificacionLeida);

export default router;