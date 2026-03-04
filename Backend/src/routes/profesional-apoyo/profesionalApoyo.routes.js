import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { reporteGeneralHandler, updateReporteGeneralHandler } from "../../controllers/profesional-apoyo/profesionalApoyo.controller.js";

const router = Router();

router.get("/reporte-general", auth, reporteGeneralHandler);
router.put("/reporte-general", auth, updateReporteGeneralHandler);

export default router;