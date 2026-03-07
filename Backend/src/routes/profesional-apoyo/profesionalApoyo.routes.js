import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { reporteGeneralHandler, updateReporteGeneralHandler } from "../../controllers/profesional-apoyo/profesionalApoyo.controller.js";
import { exportReporteGeneralExcel } from "../../controllers/profesional-apoyo/reporte.excel.controller.js";


const router = Router();

router.get("/reporte-general", auth, reporteGeneralHandler);
router.put("/reporte-general", auth, updateReporteGeneralHandler);
router.get("/export-excel", auth, authorizeRoles("Secretaria", "Admin"), exportReporteGeneralExcel);

export default router;