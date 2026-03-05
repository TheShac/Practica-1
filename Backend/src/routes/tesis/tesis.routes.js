import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import {
  getMisTesis,
  createTesisHandler,
  updateTesisHandler,
  deleteTesisHandler,
  listTesisDeAcademico,
  createTesisParaAcademico,
  updateTesisParaAcademico,
  deleteTesisParaAcademico,
} from "../../controllers/tesis/tesis.controller.js";

const router = Router();

router.get("/:nivel", auth, getMisTesis);
router.post("/", auth, createTesisHandler);
router.put("/:id", auth, updateTesisHandler);
router.delete("/:id", auth, deleteTesisHandler);

const sec = [auth, authorizeRoles("Secretaria")];

router.get(   "/academico/:usuarioId/:nivel", ...sec, listTesisDeAcademico);
router.post(  "/academico/:usuarioId",        ...sec, createTesisParaAcademico);
router.put(   "/academico/:usuarioId/:id",    ...sec, updateTesisParaAcademico);
router.delete("/academico/:usuarioId/:id",    ...sec, deleteTesisParaAcademico);

export default router;