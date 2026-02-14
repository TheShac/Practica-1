import { Router } from "express";
import { auth } from "../../middleware/auth.js";

import {
  listMisLibros,
  createLibroHandler,
  updateLibroHandler,
  deleteLibroHandler,
} from "../../controllers/libros/libro.controller.js";

const router = Router();

router.get("/mios", auth, listMisLibros);
router.post("/", auth, createLibroHandler);
router.put("/:id", auth, updateLibroHandler);
router.delete("/:id", auth, deleteLibroHandler);

export default router;
