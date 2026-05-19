import { Router }                  from 'express';
// import { auth, authorizeRoles }    from '../../middlewares/auth.js';

import { academicoRouter as tesisAcademicoRouter }         from '../../modules/tesis/tesis.routes.js';
import { academicoRouter as publicacionesAcademicoRouter } from '../../modules/publicaciones/publicacion.routes.js';
import { academicoRouter as libroAcademicoRouter }         from '../../modules/libros/libro/libro.routes.js';
import { academicoRouter as capLibroAcademicoRouter }      from '../../modules/libros/cap-libro/cap.libro.routes.js';
import { academicoRouter as investigacionAcademicoRouter } from '../../modules/investigacion/investigacion.routes.js';
import { academicoRouter as patenteAcademicoRouter }       from '../../modules/patente/patente.routes.js';
import { academicoRouter as proyectoAcademicoRouter }      from '../../modules/proyectos-intervenciones/proyecto.intervencion.routes.js';
import { academicoRouter as consultoriasRouter }           from '../../modules/consultorias/consultorias.routes.js';

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