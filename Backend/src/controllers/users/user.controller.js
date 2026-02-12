import bcrypt from "bcrypt";
import {
  listUsers,
  findUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getRoleIdByName,
} from "../../models/users/user.model.js";

export async function getAllUsers(req, res) {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando usuarios" });
  }
}

export async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo usuario" });
  }
}

export async function createUserHandler(req, res) {
  try {
    const {
      rut,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      password,
      lineas_investigacion,
      rol,
      rol_id,
      rolaca_id,
    } = req.body;

    if (!rut || !primer_nombre || !primer_apellido || !correo || !password || !lineas_investigacion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    let finalRolId = rol_id;
    if (!finalRolId && rol) {
      finalRolId = await getRoleIdByName(rol);
    }
    if (!finalRolId) return res.status(400).json({ message: "rol o rol_id inválido" });

    const contrasena_hash = await bcrypt.hash(password, 10);

    const newId = await createUser({
      rut,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      contrasena_hash,
      lineas_investigacion,
      rol_id: finalRolId,
      rolaca_id,
    });

    const created = await findUserById(newId);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Rut o correo ya existe" });
    }
    res.status(500).json({ message: "Error creando usuario" });
  }
}

export async function updateUserHandler(req, res) {
  try {
    const { id } = req.params;
    const existing = await findUserById(id);
    if (!existing) return res.status(404).json({ message: "Usuario no encontrado" });

    await updateUser(id, req.body);
    const updated = await findUserById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Rut o correo ya existe" });
    }
    res.status(500).json({ message: "Error actualizando usuario" });
  }
}

export async function updatePasswordHandler(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "password requerido" });

    const existing = await findUserById(id);
    if (!existing) return res.status(404).json({ message: "Usuario no encontrado" });

    const hash = await bcrypt.hash(password, 10);
    await updateUserPassword(id, hash);
    res.json({ message: "Contraseña actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando contraseña" });
  }
}

export async function deleteUserHandler(req, res) {
  try {
    const { id } = req.params;
    const existing = await findUserById(id);
    if (!existing) return res.status(404).json({ message: "Usuario no encontrado" });

    await deleteUser(id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando usuario" });
  }
}
