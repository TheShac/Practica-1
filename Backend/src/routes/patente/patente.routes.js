import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import {
  getMisPatentes,
  createPatenteHandler,
  updatePatenteHandler,
  deletePatenteHandler,
} from "../../controllers/patente/patente.controller.js";

const router = Router();

router.use(auth);

router.get("/", getMisPatentes);
router.post("/", createPatenteHandler);
router.put("/:id", updatePatenteHandler);
router.delete("/:id", deletePatenteHandler);

export default router;
