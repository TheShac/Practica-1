import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { reporteGeneralHandler } from "../../controllers/profesional-apoyo/profesionalApoyo.controller.js";

const router = Router();

router.get("/reporte-general", auth, reporteGeneralHandler);

export default router;