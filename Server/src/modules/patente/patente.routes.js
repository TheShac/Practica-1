import { Router }               from 'express';
import { auth, authorizeRoles } from '../../middlewares/auth.js';
import {
  getMisPatentes, createPatenteHandler,
  updatePatenteHandler, deletePatenteHandler,
  listPatentesDeAcademico, createPatenteParaAcademico,
  updatePatenteParaAcademico, deletePatenteParaAcademico,
} from './patente.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
const academicoRouter = Router();

academicoRouter.get(   '/',    auth, getMisPatentes);
academicoRouter.post(  '/',    auth, createPatenteHandler);
academicoRouter.put(   '/:id', auth, updatePatenteHandler);
academicoRouter.delete('/:id', auth, deletePatenteHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

secretariaRouter.get(   '/academico/:usuarioId',     ...sec, listPatentesDeAcademico);
secretariaRouter.post(  '/academico/:usuarioId',     ...sec, createPatenteParaAcademico);
secretariaRouter.put(   '/academico/:usuarioId/:id', ...sec, updatePatenteParaAcademico);
secretariaRouter.delete('/academico/:usuarioId/:id', ...sec, deletePatenteParaAcademico);

export { academicoRouter, secretariaRouter };