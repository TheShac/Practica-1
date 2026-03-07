import { Router } from "express";
import { auth, authorizeRoles } from "../../../middleware/auth.js";
import {
  getMisConsultorias,
  createConsultoriaHandler,
  updateConsultoriaHandler,
  deleteConsultoriaHandler,
  listConsultoriasDeAcademico,
  createConsultoriaParaAcademico,
  updateConsultoriaParaAcademico,
  deleteConsultoriaParaAcademico,
} from "../../../controllers/academico/consultorias/consultorias.controller.js";

const router = Router();

// Académico
router.use(auth);

router.get(    "/",    getMisConsultorias);
router.post(   "/",    createConsultoriaHandler);
router.put(    "/:id", updateConsultoriaHandler);
router.delete( "/:id", deleteConsultoriaHandler);

// Secretaria
const sec = [auth, authorizeRoles("Secretaria")];

router.get(    "/academico/:usuarioId",     ...sec, listConsultoriasDeAcademico);
router.post(   "/academico/:usuarioId",     ...sec, createConsultoriaParaAcademico);
router.put(    "/academico/:usuarioId/:id", ...sec, updateConsultoriaParaAcademico);
router.delete( "/academico/:usuarioId/:id", ...sec, deleteConsultoriaParaAcademico);

export default router;