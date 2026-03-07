import { Router } from "express";
import { getFichaAcademica, exportFichaAcademicaExcel, exportFichaAcademicaMagisterExcel } from "../controllers/ficha.controller.js";
import { auth, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/:usuarioId", auth, authorizeRoles("Secretaria", "Admin"), getFichaAcademica);
router.get("/:usuarioId/export", auth, authorizeRoles("Secretaria", "Admin"), exportFichaAcademicaExcel);
router.get("/:usuarioId/export-magister", auth, authorizeRoles("Secretaria", "Admin"), exportFichaAcademicaMagisterExcel);

export default router;