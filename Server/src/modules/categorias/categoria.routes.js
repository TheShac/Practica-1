import { Router }       from 'express';
import { auth }         from '../../middlewares/auth.js';
import { listCategorias } from './categoria.controller.js';

const router = Router();

// GET /api/categorias
router.get('/', auth, listCategorias);

export default router;