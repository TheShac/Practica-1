import {
  getInvestigacionesByUsuario, getInvestigacionById,
  createInvestigacion, updateInvestigacion, deleteInvestigacion,
} from './investigacion.model.js';

// ── Helper ─────────────────────────────────────────────────────────────────

function validarCampos({ titulo }) {
  if (!titulo) {
    const err = new Error('Título obligatorio');
    err.status = 400;
    throw err;
  }
}

// ── Académico ──────────────────────────────────────────────────────────────

export async function getMisInvestigacionesService(usuario_id) {
  return getInvestigacionesByUsuario(usuario_id);
}

export async function createInvestigacionService(usuario_id, body) {
  validarCampos(body);
  const newId = await createInvestigacion({ usuario_id, ...body });
  return { investigacion_id: newId };
}

export async function updateInvestigacionService(id, body) {
  await updateInvestigacion(id, body);
  return { message: 'Investigación actualizada' };
}

export async function deleteInvestigacionService(id) {
  await deleteInvestigacion(id);
  return { message: 'Investigación eliminada' };
}

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function listInvestigacionesDeAcademicoService(usuarioId) {
  return getInvestigacionesByUsuario(usuarioId);
}

export async function createInvestigacionParaAcademicoService(usuarioId, body) {
  validarCampos(body);
  const newId = await createInvestigacion({ usuario_id: usuarioId, ...body });
  return { investigacion_id: newId };
}

export async function updateInvestigacionParaAcademicoService(id, body) {
  await updateInvestigacion(id, body);
  return { message: 'Investigación actualizada' };
}

export async function deleteInvestigacionParaAcademicoService(id) {
  await deleteInvestigacion(id);
  return { message: 'Investigación eliminada' };
}