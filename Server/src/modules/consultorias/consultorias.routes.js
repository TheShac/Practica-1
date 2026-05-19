import { Router }               from 'express';
import { auth, authorizeRoles } from '../../middlewares/auth.js';
import {
  getMisConsultorias, createConsultoriaHandler,
  updateConsultoriaHandler, deleteConsultoriaHandler,
  listConsultoriasDeAcademico, createConsultoriaParaAcademico,
  updateConsultoriaParaAcademico, deleteConsultoriaParaAcademico,
} from './consultorias.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
const academicoRouter = Router();

academicoRouter.get(   '/',    auth, getMisConsultorias);
academicoRouter.post(  '/',    auth, createConsultoriaHandler);
academicoRouter.put(   '/:id', auth, updateConsultoriaHandler);
academicoRouter.delete('/:id', auth, deleteConsultoriaHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

// Rutas fijas antes de dinámicas
secretariaRouter.get(   '/academico/:usuarioId',     ...sec, listConsultoriasDeAcademico);
secretariaRouter.post(  '/academico/:usuarioId',     ...sec, createConsultoriaParaAcademico);
secretariaRouter.put(   '/academico/:usuarioId/:id', ...sec, updateConsultoriaParaAcademico);
secretariaRouter.delete('/academico/:usuarioId/:id', ...sec, deleteConsultoriaParaAcademico);

export { academicoRouter, secretariaRouter };