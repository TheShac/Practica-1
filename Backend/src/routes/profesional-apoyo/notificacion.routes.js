import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import {
  enviarNotificacion,
  listarEnviadas,
  eliminarNotificacion,
  misNotificaciones,
  marcarNotificacionLeida,
  contarNoLeidas,
} from "../../controllers/profesional-apoyo/notificacion.controller.js";

const router = Router();

// ── Secretaria ────────────────────────────────────────────────────────────────
const sec = [auth, authorizeRoles("Secretaria")];

router.post(   "/",     ...sec, enviarNotificacion);
router.get(    "/enviadas", ...sec, listarEnviadas);
router.delete( "/:id",  ...sec, eliminarNotificacion);

// ── Académico ─────────────────────────────────────────────────────────────────
router.get(    "/mis",        auth, misNotificaciones);
router.put(    "/:id/leida",  auth, marcarNotificacionLeida);
router.get(    "/no-leidas",  auth, contarNoLeidas);

export default router;