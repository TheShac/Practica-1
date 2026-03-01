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
  updateAcademicoProfileHandler
} from "../../controllers/users/user.controller.js";

const router = Router();

// Académicos
router.get("/academicos", auth, authorizeRoles("Secretaria"), getAcademicos);
router.get("/academicos/:id/perfil", auth, authorizeRoles("Admin", "Secretaria", "Academico"), getAcademicoFullProfileHandler);
router.put("/academicos/:id/perfil", auth, authorizeRoles("Academico", "Admin"), updateAcademicoProfileHandler);

// Administración de usuarios
router.get("/", auth, authorizeRoles("Admin"), getAllUsers);
router.get("/:id", auth, authorizeRoles("Admin"), getUser);
router.post("/", auth, authorizeRoles("Admin"), createUserHandler);
router.put("/:id", auth, authorizeRoles("Admin"), updateUserHandler);
router.put("/:id/password", auth, authorizeRoles("Admin"), updatePasswordHandler);
router.delete("/:id", auth, authorizeRoles("Admin"), deleteUserHandler);

export default router;