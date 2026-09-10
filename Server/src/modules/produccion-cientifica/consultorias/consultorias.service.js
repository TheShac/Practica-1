import {
  getConsultoriasByUsuario, getConsultoriaById,
  createConsultoria, updateConsultoria, deleteConsultoria,
} from './consultorias.model.js';

// ── Helper ─────────────────────────────────────────────────────────────────

function validarCampos({ titulo }) {
  if (!titulo) {
    const err = new Error('Título obligatorio');
    err.status = 400;
    throw err;
  }
}

async function obtenerConsultoriaOFallar(id) {
  const consultoria = await getConsultoriaById(id);
  if (!consultoria) {
    const err = new Error('Consultoría no encontrada');
    err.status = 404;
    throw err;
  }
  return consultoria;
}

// ── Académico ──────────────────────────────────────────────────────────────

export async function getMisConsultoriasService(usuario_id) {
  return getConsultoriasByUsuario(usuario_id);
}

export async function createConsultoriaService(usuario_id, body) {
  validarCampos(body);
  const newId = await createConsultoria(usuario_id, body);
  return getConsultoriaById(newId);
}

export async function updateConsultoriaService(id, body) {
  await obtenerConsultoriaOFallar(id);
  await updateConsultoria(id, body);
  return getConsultoriaById(id);
}

export async function deleteConsultoriaService(id) {
  await obtenerConsultoriaOFallar(id);
  await deleteConsultoria(id);
  return { message: 'Consultoría eliminada' };
}

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function listConsultoriasDeAcademicoService(usuarioId) {
  return getConsultoriasByUsuario(usuarioId);
}

export async function createConsultoriaParaAcademicoService(usuarioId, body) {
  validarCampos(body);
  const newId = await createConsultoria(usuarioId, body);
  return getConsultoriaById(newId);
}

export async function updateConsultoriaParaAcademicoService(id, body) {
  await obtenerConsultoriaOFallar(id);
  await updateConsultoria(id, body);
  return getConsultoriaById(id);
}

export async function deleteConsultoriaParaAcademicoService(id) {
  await obtenerConsultoriaOFallar(id);
  await deleteConsultoria(id);
  return { message: 'Consultoría eliminada' };
}