import {
  listLibrosByUser, getLibroById,
  createLibro, updateLibro, deleteLibro,
} from './libro.model.js';

// ── Helpers ────────────────────────────────────────────────────────────────

function validarCampos({ nombre_libro }) {
  if (!nombre_libro) {
    const err = new Error('nombre_libro es obligatorio');
    err.status = 400;
    throw err;
  }
}

async function obtenerLibroOFallar(id) {
  const libro = await getLibroById(id);
  if (!libro) {
    const err = new Error('Libro no encontrado');
    err.status = 404;
    throw err;
  }
  return libro;
}

// ── Académico ──────────────────────────────────────────────────────────────

export async function listMisLibrosService(usuario_id) {
  return listLibrosByUser(usuario_id);
}

export async function createLibroService(usuario_id, body) {
  validarCampos(body);
  const newId = await createLibro(usuario_id, body);
  return getLibroById(newId);
}

export async function updateLibroService(id, usuario_id, body) {
  const existing = await obtenerLibroOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  validarCampos(body);
  await updateLibro(id, body);
  return getLibroById(id);
}

export async function deleteLibroService(id, usuario_id) {
  const existing = await obtenerLibroOFallar(id);

  if (Number(existing.usuario_id) !== Number(usuario_id)) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }

  await deleteLibro(id);
  return { message: 'Libro eliminado' };
}

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function listLibrosDeAcademicoService(usuarioId) {
  return listLibrosByUser(usuarioId);
}

export async function createLibroParaAcademicoService(usuarioId, body) {
  validarCampos(body);
  const newId = await createLibro(usuarioId, body);
  return getLibroById(newId);
}

export async function updateLibroParaAcademicoService(id, body) {
  await obtenerLibroOFallar(id);
  validarCampos(body);
  await updateLibro(id, body);
  return getLibroById(id);
}

export async function deleteLibroParaAcademicoService(id) {
  await obtenerLibroOFallar(id);
  await deleteLibro(id);
  return { message: 'Libro eliminado' };
}