import { Router }               from 'express';
import { auth, authorizeRoles } from '../../../middlewares/auth.js';
import {
  listMisLibros, createLibroHandler,
  updateLibroHandler, deleteLibroHandler,
  listLibrosDeAcademico, createLibroParaAcademico,
  updateLibroParaAcademico, deleteLibroParaAcademico,
} from './libro.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
const academicoRouter = Router();

academicoRouter.get(   '/mios', auth, listMisLibros);
academicoRouter.post(  '/',     auth, createLibroHandler);
academicoRouter.put(   '/:id',  auth, updateLibroHandler);
academicoRouter.delete('/:id',  auth, deleteLibroHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

secretariaRouter.get(   '/academico/:usuarioId',     ...sec, listLibrosDeAcademico);
secretariaRouter.post(  '/academico/:usuarioId',     ...sec, createLibroParaAcademico);
secretariaRouter.put(   '/academico/:usuarioId/:id', ...sec, updateLibroParaAcademico);
secretariaRouter.delete('/academico/:usuarioId/:id', ...sec, deleteLibroParaAcademico);

export { academicoRouter, secretariaRouter };