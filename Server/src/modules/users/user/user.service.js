import bcrypt from 'bcrypt';
import {
  listUsers, findUserById, createUser, updateUser,
  updateUserPassword, deleteUser, getRoleIdByName,
  listAcademicos, getAcademicoFullProfile, updateAcademicoProfile,
  listRoles, listRolesAcademico,
  createRol, updateRol, deleteRol,
  createRolAcademico, updateRolAcademico, deleteRolAcademico,
} from './user.model.js';

// ── Usuario ────────────────────────────────────────────────────────────────

export async function getAllUsersService() {
  return listUsers();
}

export async function getUserService(id) {
  const user = await findUserById(id);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return user;
}

export async function createUserService(body) {
  const { rut, primer_nombre, primer_apellido, password, rol, rol_id } = body;

  if (!rut || !primer_nombre || !primer_apellido || !password) {
    const err = new Error('Faltan campos obligatorios');
    err.status = 400;
    throw err;
  }

  const finalRolId     = rol_id || (await getRoleIdByName(rol));
  const contrasena_hash = await bcrypt.hash(password, 10);
  const id             = await createUser({ ...body, contrasena_hash, rol_id: finalRolId });

  return findUserById(id);
}

export async function updateUserService(id, body) {
  await updateUser(id, body);
  return findUserById(id);
}

export async function updatePasswordService(id, password) {
  const hash = await bcrypt.hash(password, 10);
  await updateUserPassword(id, hash);
  return { message: 'Contraseña actualizada' };
}

export async function deleteUserService(id) {
  await deleteUser(id);
  return { message: 'Usuario eliminado' };
}

// ── Rol ────────────────────────────────────────────────────────────────────

export async function getRolesService() {
  return listRoles();
}

export async function createRolService(nombre) {
  if (!nombre) {
    const err = new Error('nombre es obligatorio');
    err.status = 400;
    throw err;
  }
  const id = await createRol(nombre);
  return { rol_id: id, nombre };
}

export async function updateRolService(id, nombre) {
  if (!nombre) {
    const err = new Error('nombre es obligatorio');
    err.status = 400;
    throw err;
  }
  await updateRol(id, nombre);
  return { rol_id: Number(id), nombre };
}

export async function deleteRolService(id) {
  await deleteRol(id);
  return { message: 'Rol eliminado' };
}

// ── Rol Académico ──────────────────────────────────────────────────────────

export async function getRolesAcademicoService() {
  return listRolesAcademico();
}

export async function createRolAcademicoService(tipo_academico) {
  if (!tipo_academico) {
    const err = new Error('tipo_academico es obligatorio');
    err.status = 400;
    throw err;
  }
  const id = await createRolAcademico(tipo_academico);
  return { rolaca_id: id, tipo_academico };
}

export async function updateRolAcademicoService(id, tipo_academico) {
  if (!tipo_academico) {
    const err = new Error('tipo_academico es obligatorio');
    err.status = 400;
    throw err;
  }
  await updateRolAcademico(id, tipo_academico);
  return { rolaca_id: Number(id), tipo_academico };
}

export async function deleteRolAcademicoService(id) {
  await deleteRolAcademico(id);
  return { message: 'Rol académico eliminado' };
}

// ── Académicos ─────────────────────────────────────────────────────────────

export async function getAcademicosService() {
  return listAcademicos();
}

export async function getAcademicoFullProfileService(id) {
  const profile = await getAcademicoFullProfile(id);
  if (!profile) {
    const err = new Error('Perfil no encontrado');
    err.status = 404;
    throw err;
  }
  return profile;
}

export async function updateAcademicoProfileService(usuarioId, body, reqUser) {
  // Validación de autorización: un Académico solo puede editar su propio perfil
  if (reqUser.rol === 'Academico' && reqUser.usuario_id !== usuarioId) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }
  await updateAcademicoProfile(usuarioId, body);
  return getAcademicoFullProfile(usuarioId);
}