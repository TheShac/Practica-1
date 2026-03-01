import bcrypt from "bcrypt";
import {
  listUsers,
  findUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getRoleIdByName,
  listAcademicos,
  getAcademicoFullProfile,
  updateAcademicoProfile
} from "../../models/users/user.model.js";

export async function getAllUsers(req, res) {
  try {
    res.json(await listUsers());
  } catch (err) {
    res.status(500).json({ message: "Error listando usuarios" });
  }
}

export async function getUser(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Error obteniendo usuario" });
  }
}

export async function createUserHandler(req, res) {
  try {
    const { rut, primer_nombre, primer_apellido, password, lineas_investigacion, rol, rol_id, rolaca_id } = req.body;

    if (!rut || !primer_nombre || !primer_apellido || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const finalRolId = rol_id || await getRoleIdByName(rol);
    const hash = await bcrypt.hash(password, 10);

    const id = await createUser({
      ...req.body,
      contrasena_hash: hash,
      rol_id: finalRolId
    });

    res.status(201).json(await findUserById(id));
  } catch (err) {
    res.status(500).json({ message: "Error creando usuario" });
  }
}

export async function updateUserHandler(req, res) {
  try {
    await updateUser(req.params.id, req.body);
    res.json(await findUserById(req.params.id));
  } catch {
    res.status(500).json({ message: "Error actualizando usuario" });
  }
}

export async function updatePasswordHandler(req, res) {
  const hash = await bcrypt.hash(req.body.password, 10);
  await updateUserPassword(req.params.id, hash);
  res.json({ message: "Contraseña actualizada" });
}

export async function deleteUserHandler(req, res) {
  await deleteUser(req.params.id);
  res.json({ message: "Usuario eliminado" });
}

export async function getAcademicos(req, res) {
  res.json(await listAcademicos());
}

export async function getAcademicoFullProfileHandler(req, res) {
  const profile = await getAcademicoFullProfile(req.params.id);
  if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });
  res.json(profile);
}

export async function updateAcademicoProfileHandler(req, res) {
  try {
    const usuarioId = parseInt(req.params.id);

    if (req.user.rol === "Academico" && req.user.usuario_id !== usuarioId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await updateAcademicoProfile(usuarioId, req.body);

    const perfilActualizado = await getAcademicoFullProfile(usuarioId);

    res.json(perfilActualizado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando perfil" });
  }
}