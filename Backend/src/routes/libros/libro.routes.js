import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";

import {
  listMisLibros,
  createLibroHandler,
  updateLibroHandler,
  deleteLibroHandler,
  listLibrosDeAcademico,
  createLibroParaAcademico,
  updateLibroParaAcademico,
  deleteLibroParaAcademico,
} from "../../controllers/libros/libro.controller.js";

const router = Router();

router.get("/mios", auth, listMisLibros);
router.post("/", auth, createLibroHandler);
router.put("/:id", auth, updateLibroHandler);
router.delete("/:id", auth, deleteLibroHandler);

const sec = [auth, authorizeRoles("Secretaria")];

router.get(   "/academico/:usuarioId",     ...sec, listLibrosDeAcademico);
router.post(  "/academico/:usuarioId",     ...sec, createLibroParaAcademico);
router.put(   "/academico/:usuarioId/:id", ...sec, updateLibroParaAcademico);
router.delete("/academico/:usuarioId/:id", ...sec, deleteLibroParaAcademico);

export default router;