import { Router }               from 'express';
import { auth, authorizeRoles } from '../../../middlewares/auth.js';
import {
  listMisCapLibros, createCapLibroHandler,
  updateCapLibroHandler, deleteCapLibroHandler,
  listCapLibrosDeAcademico, createCapLibroParaAcademico,
  updateCapLibroParaAcademico, deleteCapLibroParaAcademico,
} from './cap.libro.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
const academicoRouter = Router();

academicoRouter.get(   '/mios', auth, listMisCapLibros);
academicoRouter.post(  '/',     auth, createCapLibroHandler);
academicoRouter.put(   '/:id',  auth, updateCapLibroHandler);
academicoRouter.delete('/:id',  auth, deleteCapLibroHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

secretariaRouter.get(   '/academico/:usuarioId',     ...sec, listCapLibrosDeAcademico);
secretariaRouter.post(  '/academico/:usuarioId',     ...sec, createCapLibroParaAcademico);
secretariaRouter.put(   '/academico/:usuarioId/:id', ...sec, updateCapLibroParaAcademico);
secretariaRouter.delete('/academico/:usuarioId/:id', ...sec, deleteCapLibroParaAcademico);

export { academicoRouter, secretariaRouter };