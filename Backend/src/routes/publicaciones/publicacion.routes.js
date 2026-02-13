import { Router } from "express";
import { auth } from "../../middleware/auth.js";

import {
  listMisPublicaciones,
  createPublicacionHandler,
  updatePublicacionHandler,
  deletePublicacionHandler,
} from "../../controllers/publicaciones/publicacion.controller.js";

const router = Router();

// solo logueados
router.get("/mias", auth, listMisPublicaciones);
router.post("/", auth, createPublicacionHandler);
router.put("/:id", auth, updatePublicacionHandler);
router.delete("/:id", auth, deletePublicacionHandler);

export default router;
