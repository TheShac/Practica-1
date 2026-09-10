import {
  getTesisById, getTesisByUsuario, createTesis, updateTesis, deleteTesis,
} from './tesis.model.js';

// ── Helpers ────────────────────────────────────────────────────────────────

const NIVELES_VALIDOS  = ['MAGISTER', 'DOCTORADO'];
const ROLES_GUIA_VALIDOS = ['GUIA', 'CO_GUIA'];

function validarNivel(nivel) {
  if (!NIVELES_VALIDOS.includes(nivel)) {
    const err = new Error('Nivel inválido');
    err.status = 400;
    throw err;
  }
}

function validarCamposObligatorios({ titulo_tesis, autor, ano, rol_guia, nivel_programa }) {
  if (!titulo_tesis || !autor || !ano || !rol_guia || !nivel_programa) {
    const err = new Error('Faltan campos obligatorios');
    err.status = 400;
    throw err;
  }
  if (!ROLES_GUIA_VALIDOS.includes(rol_guia)) {
    const err = new Error('Rol guía inválido');
    err.status = 400;
    throw err;
  }
  if (!NIVELES_VALIDOS.includes(nivel_programa)) {
    const err = new Error('Nivel programa inválido');
    err.status = 400;
    throw err;
  }
}

async function obtenerTesisOFallar(tesis_id) {
  const tesis = await getTesisById(tesis_id);
  if (!tesis) {
    const err = new Error('Tesis no encontrada');
    err.status = 404;
    throw err;
  }
  return tesis;
}

// ── Servicios del Académico (usa su propio usuario_id del token) ───────────

export async function getMisTesisService(usuario_id, nivel) {
  const nivelUpper = nivel?.toUpperCase();
  validarNivel(nivelUpper);
  return getTesisByUsuario(usuario_id, nivelUpper);
}

export async function createTesisService(usuario_id, body) {
  validarCamposObligatorios(body);
  const newId = await createTesis({ usuario_id, ...body });
  return { message: 'Tesis creada correctamente', tesis_id: newId };
}

export async function updateTesisService(tesis_id, usuario_id, body) {
  const tesis = await obtenerTesisOFallar(tesis_id);

  // Solo el dueño puede editar su propia tesis
  if (tesis.usuario_id !== usuario_id) {
    const err = new Error('No tienes permiso para editar esta tesis');
    err.status = 403;
    throw err;
  }

  await updateTesis(tesis_id, body);
  return { message: 'Tesis actualizada correctamente' };
}

export async function deleteTesisService(tesis_id, usuario_id) {
  await deleteTesis(tesis_id, usuario_id);
  return { message: 'Tesis eliminada correctamente' };
}

// ── Servicios de la Secretaria (opera sobre cualquier académico) ───────────

export async function listTesisDeAcademicoService(usuarioId, nivel) {
  const nivelUpper = nivel?.toUpperCase();
  validarNivel(nivelUpper);
  return getTesisByUsuario(usuarioId, nivelUpper);
}

export async function createTesisParaAcademicoService(usuarioId, body) {
  validarCamposObligatorios(body);
  const newId = await createTesis({ usuario_id: usuarioId, ...body });
  return { message: 'Tesis creada correctamente', tesis_id: newId };
}

export async function updateTesisParaAcademicoService(tesis_id, body) {
  await obtenerTesisOFallar(tesis_id);
  await updateTesis(tesis_id, body);
  return { message: 'Tesis actualizada correctamente' };
}

export async function deleteTesisParaAcademicoService(tesis_id) {
  await obtenerTesisOFallar(tesis_id);
  await deleteTesis(tesis_id);
  return { message: 'Tesis eliminada correctamente' };
}