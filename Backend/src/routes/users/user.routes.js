import { Router } from "express";
import { auth, authorizeRoles } from "../../middleware/auth.js";
import {
  getAllUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
  updatePasswordHandler,
  deleteUserHandler,
  getAcademicoProfile,
  getAcademicos
} from "../../controllers/users/user.controller.js";

const router = Router();

router.get("/academicos", auth, authorizeRoles("Secretaria"), getAcademicos);
router.get("/", auth, authorizeRoles("Admin"), getAllUsers);
router.get("/:id", auth, authorizeRoles("Admin"), getUser);
router.post("/", auth, authorizeRoles("Admin"), createUserHandler);
router.put("/:id", auth, authorizeRoles("Admin"), updateUserHandler);
router.put("/:id/password", auth, authorizeRoles("Admin"), updatePasswordHandler);
router.delete("/:id", auth, authorizeRoles("Admin"), deleteUserHandler);
router.get("/academicos/:id/perfil", auth, authorizeRoles("Admin", "Secretaria", "Academico"), getAcademicoProfile);

export default router;