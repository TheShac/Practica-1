import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import {
  getMisPatentes,
  createPatenteHandler,
  updatePatenteHandler,
  deletePatenteHandler,
  listPatentesDeAcademico,
  createPatenteParaAcademico,
  updatePatenteParaAcademico,
  deletePatenteParaAcademico,
} from "../../controllers/patente/patente.controller.js";

const router = Router();

router.use(auth);

router.get("/", getMisPatentes);
router.post("/", createPatenteHandler);
router.put("/:id", updatePatenteHandler);
router.delete("/:id", deletePatenteHandler);

const sec = [auth, authorizeRoles("Secretaria")];

router.get(   "/academico/:usuarioId",     ...sec, listPatentesDeAcademico);
router.post(  "/academico/:usuarioId",     ...sec, createPatenteParaAcademico);
router.put(   "/academico/:usuarioId/:id", ...sec, updatePatenteParaAcademico);
router.delete("/academico/:usuarioId/:id", ...sec, deletePatenteParaAcademico);

export default router;