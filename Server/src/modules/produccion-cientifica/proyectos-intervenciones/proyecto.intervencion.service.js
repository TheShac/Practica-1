import {
  listProyectosByUser, getProyectoById,
  createProyecto, updateProyecto, deleteProyecto,
} from './proyecto.intervencion.model.js';

// ── Helper ─────────────────────────────────────────────────────────────────

function validarCampos({ titulo }) {
  if (!titulo) {
    const err = new Error('El campo titulo es obligatorio');
    err.status = 400;
    throw err;
  }
}

async function obtenerProyectoOFallar(id) {
  const proyecto = await getProyectoById(id);
  if (!proyecto) {
    const err = new Error('Proyecto no encontrado');
    err.status = 404;
    throw err;
  }
  return proyecto;
}

// ── Académico ──────────────────────────────────────────────────────────────

export async function listMisProyectosService(usuario_id) {
  return listProyectosByUser(usuario_id);
}

export async function createProyectoService(usuario_id, body) {
  validarCampos(body);
  const newId = await createProyecto(usuario_id, body);
  return getProyectoById(newId);
}

export async function updateProyectoService(id, usuario_id, body) {
  const existing = await obtenerProyectoOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  validarCampos(body);
  await updateProyecto(id, body);
  return getProyectoById(id);
}

export async function deleteProyectoService(id, usuario_id) {
  const existing = await obtenerProyectoOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  await deleteProyecto(id);
  return { message: 'Proyecto eliminado' };
}

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function listProyectosDeAcademicoService(usuarioId) {
  return listProyectosByUser(usuarioId);
}

export async function createProyectoParaAcademicoService(usuarioId, body) {
  validarCampos(body);
  const newId = await createProyecto(usuarioId, body);
  return getProyectoById(newId);
}

export async function updateProyectoParaAcademicoService(id, body) {
  await obtenerProyectoOFallar(id);
  validarCampos(body);
  await updateProyecto(id, body);
  return getProyectoById(id);
}

export async function deleteProyectoParaAcademicoService(id) {
  await obtenerProyectoOFallar(id);
  await deleteProyecto(id);
  return { message: 'Proyecto eliminado' };
}