import { Router } from "express";
import { getFichaAcademica, exportFichaAcademicaExcel } from "../controllers/ficha.controller.js";
import { auth, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/:usuarioId", auth, authorizeRoles("Secretaria", "Admin"), getFichaAcademica);
router.get("/:usuarioId/export", auth, authorizeRoles("Secretaria", "Admin"), exportFichaAcademicaExcel);

export default router;