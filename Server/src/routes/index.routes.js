import { Router } from 'express';

import publicPortal           from './portals/public.routes.js';
import adminPortal            from './portals/admin.routes.js';
import academicoPortal        from './portals/academico.routes.js';
import profesionalApoyoPortal from './portals/profesional-apoyo.routes.js';

// Recurso compartido entre académico y secretaria
import categoriaRoutes from '../modules/categorias/categoria.routes.js';
import notificacionRoutes from '../modules/profesional-apoyo/notificacion/notificacion.routes.js';

const router = Router();

router.use('/categorias', categoriaRoutes);
router.use('/notificaciones', notificacionRoutes);

router.use(publicPortal);
router.use(adminPortal);
router.use(academicoPortal);
router.use(profesionalApoyoPortal);

export default router;