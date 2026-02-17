import { Router } from "express";
import { getFichaAcademica } from "../controllers/ficha.controller.js";
import { auth, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/:usuarioId", auth, authorizeRoles("Secretaria", "Admin"), getFichaAcademica);

export default router;
