import {
  listCapLibrosByUser, getCapLibroById,
  createCapLibro, updateCapLibro, deleteCapLibro,
} from './cap.libro.model.js';

// ── Helpers ────────────────────────────────────────────────────────────────

function validarCampos({ nombre_capitulo }) {
  if (!nombre_capitulo) {
    const err = new Error('nombre_capitulo es obligatorio');
    err.status = 400;
    throw err;
  }
}

async function obtenerCapLibroOFallar(id) {
  const cap = await getCapLibroById(id);
  if (!cap) {
    const err = new Error('Registro no encontrado');
    err.status = 404;
    throw err;
  }
  return cap;
}

// ── Académico ──────────────────────────────────────────────────────────────

export async function listMisCapLibrosService(usuario_id) {
  return listCapLibrosByUser(usuario_id);
}

export async function createCapLibroService(usuario_id, body) {
  validarCampos(body);
  const newId = await createCapLibro(usuario_id, body);
  return getCapLibroById(newId);
}

export async function updateCapLibroService(id, usuario_id, body) {
  const existing = await obtenerCapLibroOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  validarCampos(body);
  await updateCapLibro(id, body);
  return getCapLibroById(id);
}

export async function deleteCapLibroService(id, usuario_id) {
  const existing = await obtenerCapLibroOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  await deleteCapLibro(id);
  return { message: 'Capítulo de libro eliminado' };
}

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function listCapLibrosDeAcademicoService(usuarioId) {
  return listCapLibrosByUser(usuarioId);
}

export async function createCapLibroParaAcademicoService(usuarioId, body) {
  validarCampos(body);
  const newId = await createCapLibro(usuarioId, body);
  return getCapLibroById(newId);
}

export async function updateCapLibroParaAcademicoService(id, body) {
  await obtenerCapLibroOFallar(id);
  validarCampos(body);
  await updateCapLibro(id, body);
  return getCapLibroById(id);
}

export async function deleteCapLibroParaAcademicoService(id) {
  await obtenerCapLibroOFallar(id);
  await deleteCapLibro(id);
  return { message: 'Capítulo de libro eliminado' };
}