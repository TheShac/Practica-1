import { Router }               from 'express';
import { auth, authorizeRoles } from '../../../middlewares/auth.js';
import {
  reporteGeneralHandler, updateReporteGeneralHandler,
  getPromediosHandler,   updatePromediosHandler,
  exportReporteGeneralExcel,
} from './reporte.controller.js';

const router = Router();
const sec    = [auth, authorizeRoles('Secretaria', 'Admin')];

// GET  /api/profesional-apoyo/reporte-general
// PUT  /api/profesional-apoyo/reporte-general
// GET  /api/profesional-apoyo/promedios
// PUT  /api/profesional-apoyo/promedios
// GET  /api/profesional-apoyo/export-excel
router.get('/reporte-general', auth, reporteGeneralHandler);
router.put('/reporte-general', auth, updateReporteGeneralHandler);
router.get('/promedios',       ...sec, getPromediosHandler);
router.put('/promedios',       ...sec, updatePromediosHandler);
router.get('/export-excel',    ...sec, exportReporteGeneralExcel);

export default router;