import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { getActualizaciones } from "../../controllers/profesional-apoyo/dashboard.controller.js";

const router = Router();

router.get("/actualizaciones", auth, authorizeRoles("Secretaria"), getActualizaciones);

export default router;