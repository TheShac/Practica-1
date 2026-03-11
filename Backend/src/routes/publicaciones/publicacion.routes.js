import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import multer from "multer";

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
const upload = multer({ storage: multer.memoryStorage() });

router.get("/mias", auth, listMisPublicaciones);
router.post("/", auth, upload.single('pdf'), createPublicacionHandler);
router.put("/:id", auth, upload.single('pdf'), updatePublicacionHandler);
router.delete("/:id", auth, deletePublicacionHandler);

const sec = [auth, authorizeRoles("Secretaria")];

router.get(   "/academico/:usuarioId",     ...sec, listPublicacionesDeAcademico);
router.post(  "/academico/:usuarioId",     ...sec,  upload.single('pdf'), createPublicacionParaAcademico);
router.put(   "/academico/:usuarioId/:id", ...sec, upload.single('pdf'), updatePublicacionParaAcademico);
router.delete("/academico/:usuarioId/:id", ...sec, deletePublicacionParaAcademico); 

export default router;
