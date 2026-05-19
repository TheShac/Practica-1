import {
  getPatentesByUsuario, getPatenteById,
  createPatente, updatePatente, deletePatente,
} from './patente.model.js';

// ── Helper ─────────────────────────────────────────────────────────────────

function validarCampos({ nombre_patente }) {
  if (!nombre_patente) {
    const err = new Error('Nombre obligatorio');
    err.status = 400;
    throw err;
  }
}

// ── Académico ──────────────────────────────────────────────────────────────

export async function getMisPatentesService(usuario_id) {
  return getPatentesByUsuario(usuario_id);
}

export async function createPatenteService(usuario_id, body) {
  validarCampos(body);
  const newId = await createPatente({ usuario_id, ...body });
  return { patente_id: newId };
}

export async function updatePatenteService(id, body) {
  await updatePatente(id, body);
  return { message: 'Patente actualizada' };
}

export async function deletePatenteService(id) {
  await deletePatente(id);
  return { message: 'Patente eliminada' };
}

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function listPatentesDeAcademicoService(usuarioId) {
  return getPatentesByUsuario(usuarioId);
}

export async function createPatenteParaAcademicoService(usuarioId, body) {
  validarCampos(body);
  const newId = await createPatente({ usuario_id: usuarioId, ...body });
  return { patente_id: newId };
}

export async function updatePatenteParaAcademicoService(id, body) {
  await updatePatente(id, body);
  return { message: 'Patente actualizada' };
}

export async function deletePatenteParaAcademicoService(id) {
  await deletePatente(id);
  return { message: 'Patente eliminada' };
}