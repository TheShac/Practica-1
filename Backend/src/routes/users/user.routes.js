import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import {
  getAllUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
  updatePasswordHandler,
  deleteUserHandler,
  getAcademicos,
  getAcademicoFullProfileHandler,
  updateAcademicoProfileHandler,
  getRoles,
  getRolesAcademico,
  createRolHandler, updateRolHandler, deleteRolHandler,
  createRolAcademicoHandler, updateRolAcademicoHandler, deleteRolAcademicoHandler,
} from "../../controllers/users/user.controller.js";

const router = Router();
const adm = [auth, authorizeRoles("Admin")];

// ── Rutas fijas primero (antes de /:id) ──────────────────
router.get(   "/roles",              ...adm, getRoles);
router.post(  "/roles",              ...adm, createRolHandler);
router.put(   "/roles/:id",          ...adm, updateRolHandler);
router.delete("/roles/:id",          ...adm, deleteRolHandler);

router.get(   "/roles-academico",    ...adm, getRolesAcademico);
router.post(  "/roles-academico",    ...adm, createRolAcademicoHandler);
router.put(   "/roles-academico/:id",...adm, updateRolAcademicoHandler);
router.delete("/roles-academico/:id",...adm, deleteRolAcademicoHandler);

router.get("/academicos",            auth, authorizeRoles("Secretaria"), getAcademicos);
router.get("/academicos/:id/perfil", auth, authorizeRoles("Admin", "Secretaria", "Academico"), getAcademicoFullProfileHandler);
router.put("/academicos/:id/perfil", auth, authorizeRoles("Academico", "Admin"), updateAcademicoProfileHandler);

// ── Rutas con parámetro /:id al final ────────────────────
router.get(   "/",    ...adm, getAllUsers);
router.post(  "/",    ...adm, createUserHandler);
router.get(   "/:id", ...adm, getUser);
router.put(   "/:id", ...adm, updateUserHandler);
router.put(   "/:id/password", ...adm, updatePasswordHandler);
router.delete("/:id", ...adm, deleteUserHandler);

export default router;