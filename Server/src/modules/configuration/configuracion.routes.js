import { Router } from "express";
import { auth, authorizeRoles } from "#src/middlewares/auth.js";
import {
  obtenerConfiguracion, actualizarConfiguracionController,
  obtenerDominios, crearDominio, borrarDominio,
} from "./configuracion.controller.js";

const router = Router();
const admin = [auth, authorizeRoles("Admin")];

router.get("/", ...admin, obtenerConfiguracion);
router.put("/", ...admin, actualizarConfiguracionController);
router.get("/dominios", ...admin, obtenerDominios);
router.post("/dominios", ...admin, crearDominio);
router.delete("/dominios/:id", ...admin, borrarDominio);

export default router;