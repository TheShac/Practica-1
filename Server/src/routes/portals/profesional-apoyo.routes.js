import { Router }               from 'express';
// import { auth, authorizeRoles } from '../../middlewares/auth.js';

import reporteRoutes        from '../../modules/profesional-apoyo/reporte/reporte.routes.js';
import fichaRoutes          from '../../modules/profesional-apoyo/ficha/ficha.routes.js';
import dashboardRoutes      from '../../modules/profesional-apoyo/dashboard/dashboard.routes.js';

import { secretariaRouter as tesisSecretariaRouter }         from '../../modules/tesis/tesis.routes.js';
import { secretariaRouter as publicacionesSecretariaRouter } from '../../modules/publicaciones/publicacion.routes.js';
import { secretariaRouter as libroSecretariaRouter }         from '../../modules/libros/libro/libro.routes.js';
import { secretariaRouter as capLibroSecretariaRouter }      from '../../modules/libros/cap-libro/cap.libro.routes.js';
import { secretariaRouter as investigacionSecretariaRouter } from '../../modules/investigacion/investigacion.routes.js';
import { secretariaRouter as patenteSecretariaRouter }       from '../../modules/patente/patente.routes.js';
import { secretariaRouter as proyectoSecretariaRouter }      from '../../modules/proyectos-intervenciones/proyecto.intervencion.routes.js';
import { secretariaRouter as consultoriasRouter }            from '../../modules/consultorias/consultorias.routes.js';
    
const router = Router();

// Barrera: debe ser Secretaria (o Admin si también administra este portal)
// router.use(auth, authorizeRoles('Secretaria', 'Admin'));

// Módulos exclusivos de la profesional de apoyo
router.use('/profesional-apoyo',  reporteRoutes);
router.use('/ficha',              fichaRoutes);
router.use('/home-profesional',   dashboardRoutes);

// Módulos compartidos con académico — rutas /academico/:usuarioId/...
router.use('/tesis',                  tesisSecretariaRouter);
router.use('/publicaciones',          publicacionesSecretariaRouter);
router.use('/libros',                 libroSecretariaRouter);
router.use('/cap-libro',              capLibroSecretariaRouter);
router.use('/investigacion',          investigacionSecretariaRouter);
router.use('/patente',                patenteSecretariaRouter);
router.use('/proyectos-intervencion', proyectoSecretariaRouter);
router.use('/consultorias',           consultoriasRouter);

export default router;