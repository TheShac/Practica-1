import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import {
  getMisInvestigaciones,
  createInvestigacionHandler,
  updateInvestigacionHandler,
  deleteInvestigacionHandler,
} from "../../controllers/investigacion/investigacion.controller.js";

const router = Router();

router.use(auth);

router.get("/", getMisInvestigaciones);
router.post("/", createInvestigacionHandler);
router.put("/:id", updateInvestigacionHandler);
router.delete("/:id", deleteInvestigacionHandler);

export default router;
