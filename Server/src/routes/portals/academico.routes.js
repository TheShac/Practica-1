import { Router }                  from 'express';
// import { auth, authorizeRoles }    from '../../middlewares/auth.js';

import { academicoRouter as tesisAcademicoRouter }         from '#src/modules/produccion-cientifica/tesis/tesis.routes.js';
import { academicoRouter as publicacionesAcademicoRouter } from '#src/modules/produccion-cientifica/publicaciones/publicacion.routes.js';
import { academicoRouter as libroAcademicoRouter }         from '#src/modules/produccion-cientifica/libros/libro/libro.routes.js';
import { academicoRouter as capLibroAcademicoRouter }      from '#src/modules/produccion-cientifica/libros/cap-libro/cap.libro.routes.js';
import { academicoRouter as investigacionAcademicoRouter } from '#src/modules/produccion-cientifica/investigacion/investigacion.routes.js';
import { academicoRouter as patenteAcademicoRouter }       from '#src/modules/produccion-cientifica/patente/patente.routes.js';
import { academicoRouter as proyectoAcademicoRouter }      from '#src/modules/produccion-cientifica/proyectos-intervenciones/proyecto.intervencion.routes.js';
import { academicoRouter as consultoriasRouter }           from '#src/modules/produccion-cientifica/consultorias/consultorias.routes.js';

const router = Router();

// Barrera: debe estar autenticado y ser Académico o Admin
// router.use(auth, authorizeRoles('Academico', 'Admin'));

router.use('/tesis',                    tesisAcademicoRouter);
router.use('/publicaciones',            publicacionesAcademicoRouter);
router.use('/libros',                   libroAcademicoRouter);
router.use('/cap-libro',                capLibroAcademicoRouter);
router.use('/investigacion',            investigacionAcademicoRouter);
router.use('/patente',                  patenteAcademicoRouter);
router.use('/proyectos-intervencion',   proyectoAcademicoRouter);
router.use('/consultorias',             consultoriasRouter);

export default router;