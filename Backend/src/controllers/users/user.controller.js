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
  updateAcademicoProfile,
  listRoles,
  listRolesAcademico,
  createRol,
  updateRol,
  deleteRol,
  createRolAcademico,
  updateRolAcademico,
  deleteRolAcademico,
} from "../../models/users/user.model.js";

export async function getAllUsers(req, res) {
  try { res.json(await listUsers()); }
  catch { res.status(500).json({ message: "Error listando usuarios" }); }
}

export async function getUser(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch { res.status(500).json({ message: "Error obteniendo usuario" }); }
}

export async function createUserHandler(req, res) {
  try {
    const { rut, primer_nombre, primer_apellido, password, rol, rol_id } = req.body;
    if (!rut || !primer_nombre || !primer_apellido || !password)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const finalRolId = rol_id || await getRoleIdByName(rol);
    const hash = await bcrypt.hash(password, 10);
    const id = await createUser({ ...req.body, contrasena_hash: hash, rol_id: finalRolId });
    res.status(201).json(await findUserById(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando usuario" });
  }
}

export async function updateUserHandler(req, res) {
  try {
    await updateUser(req.params.id, req.body);
    res.json(await findUserById(req.params.id));
  } catch { res.status(500).json({ message: "Error actualizando usuario" }); }
}

export async function updatePasswordHandler(req, res) {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await updateUserPassword(req.params.id, hash);
    res.json({ message: "Contraseña actualizada" });
  } catch { res.status(500).json({ message: "Error actualizando contraseña" }); }
}

export async function deleteUserHandler(req, res) {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch { res.status(500).json({ message: "Error eliminando usuario" }); }
}

// ── ROL ──────────────────────────────────────────────────
export async function getRoles(req, res) {
  try { res.json(await listRoles()); }
  catch { res.status(500).json({ message: "Error obteniendo roles" }); }
}

export async function createRolHandler(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: "nombre es obligatorio" });
    const id = await createRol(nombre);
    res.status(201).json({ rol_id: id, nombre });
  } catch { res.status(500).json({ message: "Error creando rol" }); }
}

export async function updateRolHandler(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: "nombre es obligatorio" });
    await updateRol(req.params.id, nombre);
    res.json({ rol_id: Number(req.params.id), nombre });
  } catch { res.status(500).json({ message: "Error actualizando rol" }); }
}

export async function deleteRolHandler(req, res) {
  try {
    await deleteRol(req.params.id);
    res.json({ message: "Rol eliminado" });
  } catch { res.status(500).json({ message: "Error eliminando rol" }); }
}

// ── ROL ACADÉMICO ────────────────────────────────────────
export async function getRolesAcademico(req, res) {
  try { res.json(await listRolesAcademico()); }
  catch { res.status(500).json({ message: "Error obteniendo roles académicos" }); }
}

export async function createRolAcademicoHandler(req, res) {
  try {
    const { tipo_academico } = req.body;
    if (!tipo_academico) return res.status(400).json({ message: "tipo_academico es obligatorio" });
    const id = await createRolAcademico(tipo_academico);
    res.status(201).json({ rolaca_id: id, tipo_academico });
  } catch { res.status(500).json({ message: "Error creando rol académico" }); }
}

export async function updateRolAcademicoHandler(req, res) {
  try {
    const { tipo_academico } = req.body;
    if (!tipo_academico) return res.status(400).json({ message: "tipo_academico es obligatorio" });
    await updateRolAcademico(req.params.id, tipo_academico);
    res.json({ rolaca_id: Number(req.params.id), tipo_academico });
  } catch { res.status(500).json({ message: "Error actualizando rol académico" }); }
}

export async function deleteRolAcademicoHandler(req, res) {
  try {
    await deleteRolAcademico(req.params.id);
    res.json({ message: "Rol académico eliminado" });
  } catch { res.status(500).json({ message: "Error eliminando rol académico" }); }
}

// ── ACADÉMICOS ───────────────────────────────────────────
export async function getAcademicos(req, res) {
  try { res.json(await listAcademicos()); }
  catch { res.status(500).json({ message: "Error listando académicos" }); }
}

export async function getAcademicoFullProfileHandler(req, res) {
  try {
    const profile = await getAcademicoFullProfile(req.params.id);
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(profile);
  } catch { res.status(500).json({ message: "Error obteniendo perfil" }); }
}

export async function updateAcademicoProfileHandler(req, res) {
  try {
    const usuarioId = parseInt(req.params.id);
    if (req.user.rol === "Academico" && req.user.usuario_id !== usuarioId)
      return res.status(403).json({ message: "No autorizado" });

    await updateAcademicoProfile(usuarioId, req.body);
    res.json(await getAcademicoFullProfile(usuarioId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando perfil" });
  }
}