import { Router } from "express";
import { auth } from "../../middleware/auth.js";

import {
  listMisCapLibros,
  createCapLibroHandler,
  updateCapLibroHandler,
  deleteCapLibroHandler,
} from "../../controllers/libros/cap.libro.controller.js";

const router = Router();

router.get("/mios", auth, listMisCapLibros);
router.post("/", auth, createCapLibroHandler);
router.put("/:id", auth, updateCapLibroHandler);
router.delete("/:id", auth, deleteCapLibroHandler);

export default router;
