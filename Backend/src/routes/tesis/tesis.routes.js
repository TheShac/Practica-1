import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import {
  getMisTesis,
  createTesisHandler,
  updateTesisHandler,
  deleteTesisHandler,
} from "../../controllers/tesis/tesis.controller.js";

const router = Router();

router.get("/:nivel", auth, authorizeRoles("Academico"), getMisTesis);
router.post("/", auth, authorizeRoles("Academico"), createTesisHandler);
router.put("/:id", auth, authorizeRoles("Academico"), updateTesisHandler);
router.delete("/:id", auth, authorizeRoles("Academico"), deleteTesisHandler);

export default router;
