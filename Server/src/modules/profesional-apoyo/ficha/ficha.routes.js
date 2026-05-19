import { Router }               from 'express';
import { auth, authorizeRoles } from '../../../middlewares/auth.js';
import {
  getFichaAcademica,
  exportFichaAcademicaExcel,
  exportFichaAcademicaMagisterExcel,
} from './ficha.controller.js';

const router = Router();
const sec    = [auth, authorizeRoles('Secretaria', 'Admin')];

// Rutas con segmento fijo ANTES de la dinámica pura /:usuarioId
// GET /api/ficha/:usuarioId/export
// GET /api/ficha/:usuarioId/export-magister
// GET /api/ficha/:usuarioId
router.get('/:usuarioId/export-magister', ...sec, exportFichaAcademicaMagisterExcel);
router.get('/:usuarioId/export',          ...sec, exportFichaAcademicaExcel);
router.get('/:usuarioId',                 ...sec, getFichaAcademica);

export default router;