import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import {
  getMisInvestigaciones,
  createInvestigacionHandler,
  updateInvestigacionHandler,
  deleteInvestigacionHandler,
  listInvestigacionesDeAcademico,
  createInvestigacionParaAcademico,
  updateInvestigacionParaAcademico,
  deleteInvestigacionParaAcademico
} from "../../controllers/investigacion/investigacion.controller.js";

const router = Router();

router.use(auth);

router.get("/", getMisInvestigaciones);
router.post("/", createInvestigacionHandler);
router.put("/:id", updateInvestigacionHandler);
router.delete("/:id", deleteInvestigacionHandler);

const sec = [auth, authorizeRoles("Secretaria")];

router.get(   "/academico/:usuarioId",     ...sec, listInvestigacionesDeAcademico);
router.post(  "/academico/:usuarioId",     ...sec, createInvestigacionParaAcademico);
router.put(   "/academico/:usuarioId/:id", ...sec, updateInvestigacionParaAcademico);
router.delete("/academico/:usuarioId/:id", ...sec, deleteInvestigacionParaAcademico); 

export default router;