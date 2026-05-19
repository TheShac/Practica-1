import { Router }               from 'express';
import { auth, authorizeRoles } from '../../middlewares/auth.js';
import {
  listMisPublicaciones, createPublicacionHandler,
  updatePublicacionHandler, deletePublicacionHandler,
  listPublicacionesDeAcademico, createPublicacionParaAcademico,
  updatePublicacionParaAcademico, deletePublicacionParaAcademico,
} from './publicacion.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
// Montado en: /api/publicaciones
const academicoRouter = Router();

academicoRouter.get(   '/mias', auth, listMisPublicaciones);
academicoRouter.post(  '/',     auth, createPublicacionHandler);
academicoRouter.put(   '/:id',  auth, updatePublicacionHandler);
academicoRouter.delete('/:id',  auth, deletePublicacionHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
// Montado en: /api/publicaciones
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

secretariaRouter.get(   '/academico/:usuarioId',     ...sec, listPublicacionesDeAcademico);
secretariaRouter.post(  '/academico/:usuarioId',     ...sec, createPublicacionParaAcademico);
secretariaRouter.put(   '/academico/:usuarioId/:id', ...sec, updatePublicacionParaAcademico);
secretariaRouter.delete('/academico/:usuarioId/:id', ...sec, deletePublicacionParaAcademico);

export { academicoRouter, secretariaRouter };