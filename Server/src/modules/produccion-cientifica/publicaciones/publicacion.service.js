import {
  listPublicacionesByUser, getPublicacionById,
  createPublicacion, updatePublicacion, deletePublicacion,
} from './publicacion.model.js';

// ── Helper ─────────────────────────────────────────────────────────────────

function validarCampos({ categoria_id, titulo_articulo }) {
  if (!categoria_id || !titulo_articulo) {
    const err = new Error('categoria_id y titulo_articulo son obligatorios');
    err.status = 400;
    throw err;
  }
}

async function obtenerPublicacionOFallar(id) {
  const pub = await getPublicacionById(id);
  if (!pub) {
    const err = new Error('Publicación no encontrada');
    err.status = 404;
    throw err;
  }
  return pub;
}

// ── Académico (opera sobre su propio usuario_id del token) ─────────────────

export async function listMisPublicacionesService(usuario_id) {
  return listPublicacionesByUser(usuario_id);
}

export async function createPublicacionService(usuario_id, body) {
  validarCampos(body);
  const newId  = await createPublicacion(usuario_id, body);
  return getPublicacionById(newId);
}

export async function updatePublicacionService(id, usuario_id, body) {
  const existing = await obtenerPublicacionOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  validarCampos(body);
  await updatePublicacion(id, body);
  return getPublicacionById(id);
}

export async function deletePublicacionService(id, usuario_id) {
  const existing = await obtenerPublicacionOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  await deletePublicacion(id);
  return { message: 'Publicación eliminada' };
}

// ── Secretaria (opera sobre cualquier académico) ───────────────────────────

export async function listPublicacionesDeAcademicoService(usuarioId) {
  return listPublicacionesByUser(usuarioId);
}

export async function createPublicacionParaAcademicoService(usuarioId, body) {
  validarCampos(body);
  const newId = await createPublicacion(usuarioId, body);
  return getPublicacionById(newId);
}

export async function updatePublicacionParaAcademicoService(id, body) {
  await obtenerPublicacionOFallar(id);
  validarCampos(body);
  await updatePublicacion(id, body);
  return getPublicacionById(id);
}

export async function deletePublicacionParaAcademicoService(id) {
  await obtenerPublicacionOFallar(id);
  await deletePublicacion(id);
  return { message: 'Publicación eliminada' };
}