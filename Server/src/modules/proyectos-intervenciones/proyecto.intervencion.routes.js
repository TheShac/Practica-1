import { Router }               from 'express';
import { auth, authorizeRoles } from '../../middlewares/auth.js';
import {
  listMisProyectos, createProyectoHandler,
  updateProyectoHandler, deleteProyectoHandler,
  listProyectosDeAcademico, createProyectoParaAcademico,
  updateProyectoParaAcademico, deleteProyectoParaAcademico,
} from './proyecto.intervencion.controller.js';

// ── Portal académico ───────────────────────────────────────────────────────
const academicoRouter = Router();

academicoRouter.get(   '/mis-proyectos',     auth, listMisProyectos);
academicoRouter.post(  '/mis-proyectos',     auth, createProyectoHandler);
academicoRouter.put(   '/mis-proyectos/:id', auth, updateProyectoHandler);
academicoRouter.delete('/mis-proyectos/:id', auth, deleteProyectoHandler);

// ── Portal secretaria ──────────────────────────────────────────────────────
const secretariaRouter = Router();
const sec = [auth, authorizeRoles('Secretaria')];

secretariaRouter.get(   '/academicos/:usuarioId/proyectos',     ...sec, listProyectosDeAcademico);
secretariaRouter.post(  '/academicos/:usuarioId/proyectos',     ...sec, createProyectoParaAcademico);
secretariaRouter.put(   '/academicos/:usuarioId/proyectos/:id', ...sec, updateProyectoParaAcademico);
secretariaRouter.delete('/academicos/:usuarioId/proyectos/:id', ...sec, deleteProyectoParaAcademico);

export { academicoRouter, secretariaRouter };