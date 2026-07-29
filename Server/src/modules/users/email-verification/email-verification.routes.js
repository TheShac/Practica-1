import { Router } from "express";
import { auth, authorizeRoles } from "#src/middlewares/auth.js";
import { loginLimiter } from "#src/middlewares/rateLimiter.js";
import { EmailVerificationController } from "./email-verification.controller.js";

const router = Router();

router.post("/registrar", auth, loginLimiter, EmailVerificationController.registrar);
router.post("/confirmar", auth, EmailVerificationController.confirmar);
router.post("/reenviar", auth, loginLimiter, EmailVerificationController.reenviar);
router.get("/estado", auth, EmailVerificationController.estado);
router.post("/:usuarioId/verificar-manual", auth, authorizeRoles("Admin"), EmailVerificationController.verificarManual);

export default router;