import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";

import {
  listMisCapLibros,
  createCapLibroHandler,
  updateCapLibroHandler,
  deleteCapLibroHandler,
  listCapLibrosDeAcademico,
  createCapLibroParaAcademico,
  updateCapLibroParaAcademico,
  deleteCapLibroParaAcademico,
} from "../../controllers/libros/cap.libro.controller.js";

const router = Router();

router.get("/mios", auth, listMisCapLibros);
router.post("/", auth, createCapLibroHandler);
router.put("/:id", auth, updateCapLibroHandler);
router.delete("/:id", auth, deleteCapLibroHandler);

const sec = [auth, authorizeRoles("Secretaria")];

router.get(   "/academico/:usuarioId",     ...sec, listCapLibrosDeAcademico);
router.post(  "/academico/:usuarioId",     ...sec, createCapLibroParaAcademico);
router.put(   "/academico/:usuarioId/:id", ...sec, updateCapLibroParaAcademico);
router.delete("/academico/:usuarioId/:id", ...sec, deleteCapLibroParaAcademico); 

export default router;