import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";

import {
  listMisProyectos,
  createProyectoHandler,
  updateProyectoHandler,
  deleteProyectoHandler,
  listProyectosDeAcademico,
  createProyectoParaAcademico,
  updateProyectoParaAcademico,
  deleteProyectoParaAcademico
} from "../../controllers/proyectos-intervenciones/proyecto.intervencion.controller.js";

const router = Router();


router.get("/mis-proyectos", auth, listMisProyectos);

router.post("/mis-proyectos", auth, createProyectoHandler);

router.put("/mis-proyectos/:id", auth, updateProyectoHandler);

router.delete("/mis-proyectos/:id", auth, deleteProyectoHandler);


router.get(
  "/academicos/:usuarioId/proyectos-",
  auth,
  listProyectosDeAcademico
);

router.post(
  "/academicos/:usuarioId/proyectos-",
  auth,
  createProyectoParaAcademico
);

router.put(
  "/academicos/:usuarioId/proyectos-/:id",
  auth,
  updateProyectoParaAcademico
);

router.delete(
  "/academicos/:usuarioId/proyectos-/:id",
  auth,
  deleteProyectoParaAcademico
);

export default router;