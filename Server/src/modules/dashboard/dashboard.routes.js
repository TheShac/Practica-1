import { Router } from "express";
import { auth, authorizeRoles } from "#src/middlewares/auth.js";
import { dashboardCorreos, dashboardNotificaciones } from "./dashboard.controller.js";

const router = Router();

router.get("/correos", auth, authorizeRoles("Admin"), dashboardCorreos);
router.get("/notificaciones", auth, authorizeRoles("Admin"), dashboardNotificaciones);

export default router;