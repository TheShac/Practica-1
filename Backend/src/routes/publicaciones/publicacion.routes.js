import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";

import {
  listMisPublicaciones,
  createPublicacionHandler,
  updatePublicacionHandler,
  deletePublicacionHandler,
  listPublicacionesDeAcademico,
  createPublicacionParaAcademico,
  updatePublicacionParaAcademico,
  deletePublicacionParaAcademico,
} from "../../controllers/publicaciones/publicacion.controller.js";

const router = Router();

router.get("/mias", auth, listMisPublicaciones);
router.post("/", auth, createPublicacionHandler);
router.put("/:id", auth, updatePublicacionHandler);
router.delete("/:id", auth, deletePublicacionHandler);

const sec = [auth, authorizeRoles("Secretaria")];

router.get(   "/academico/:usuarioId",     ...sec, listPublicacionesDeAcademico);
router.post(  "/academico/:usuarioId",     ...sec, createPublicacionParaAcademico);
router.put(   "/academico/:usuarioId/:id", ...sec, updatePublicacionParaAcademico);
router.delete("/academico/:usuarioId/:id", ...sec, deletePublicacionParaAcademico); 

export default router;
