import { Router } from "express";
import { loginLimiter } from "#src/middlewares/rateLimiter.js";
import { PasswordResetController } from "./password-reset.controller.js";

const router = Router();

router.post("/solicitar", loginLimiter, PasswordResetController.solicitar);
router.post("/confirmar", PasswordResetController.confirmar);

export default router;