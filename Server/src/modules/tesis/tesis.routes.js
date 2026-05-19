import { Router }               from 'express';
import { auth, authorizeRoles } from '../../middlewares/auth.js';
import {
  getMisTesis, createTesisHandler,
  updateTesisHandler, deleteTesisHandler,
  listTesisDeAcademico, createTesisParaAcademico,
  updateTesisParaAcademico, deleteTesisParaAcademico,
} from './tesis.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
// Montado en: /api/tesis
const academicoRouter = Router();

academicoRouter.get(   '/:nivel', auth, getMisTesis);
academicoRouter.post(  '/',       auth, createTesisHandler);
academicoRouter.put(   '/:id',    auth, updateTesisHandler);
academicoRouter.delete('/:id',    auth, deleteTesisHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
// Montado en: /api/tesis
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

// Rutas fijas ANTES de dinámicas — bug original corregido
secretariaRouter.get(   '/academico/:usuarioId/:nivel', ...sec, listTesisDeAcademico);
secretariaRouter.post(  '/academico/:usuarioId',        ...sec, createTesisParaAcademico);
secretariaRouter.put(   '/academico/:usuarioId/:id',    ...sec, updateTesisParaAcademico);
secretariaRouter.delete('/academico/:usuarioId/:id',    ...sec, deleteTesisParaAcademico);

export { academicoRouter, secretariaRouter };