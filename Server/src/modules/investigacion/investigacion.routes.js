import { Router }               from 'express';
import { auth, authorizeRoles } from '../../middlewares/auth.js';
import {
  getMisInvestigaciones, createInvestigacionHandler,
  updateInvestigacionHandler, deleteInvestigacionHandler,
  listInvestigacionesDeAcademico, createInvestigacionParaAcademico,
  updateInvestigacionParaAcademico, deleteInvestigacionParaAcademico,
} from './investigacion.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
const academicoRouter = Router();

academicoRouter.get(   '/',    auth, getMisInvestigaciones);
academicoRouter.post(  '/',    auth, createInvestigacionHandler);
academicoRouter.put(   '/:id', auth, updateInvestigacionHandler);
academicoRouter.delete('/:id', auth, deleteInvestigacionHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

// Rutas fijas antes de dinámicas
secretariaRouter.get(   '/academico/:usuarioId',     ...sec, listInvestigacionesDeAcademico);
secretariaRouter.post(  '/academico/:usuarioId',     ...sec, createInvestigacionParaAcademico);
secretariaRouter.put(   '/academico/:usuarioId/:id', ...sec, updateInvestigacionParaAcademico);
secretariaRouter.delete('/academico/:usuarioId/:id', ...sec, deleteInvestigacionParaAcademico);

export { academicoRouter, secretariaRouter };