import {
  createNotificacion, getNotificacionesEnviadas, deleteNotificacion,
  getNotificacionesParaAcademico, marcarLeida, countNoLeidas,
} from './notificacion.model.js';

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function enviarNotificacionService({ remitente_id, asunto, mensaje, es_global, destinatarios = [] }) {
  if (!asunto?.trim() || !mensaje?.trim()) {
    const err = new Error('Asunto y mensaje son obligatorios');
    err.status = 400;
    throw err;
  }
  if (!es_global && destinatarios.length === 0) {
    const err = new Error('Debes seleccionar al menos un destinatario');
    err.status = 400;
    throw err;
  }
  const id = await createNotificacion({ remitente_id, asunto, mensaje, es_global, destinatarios });
  return { notificacion_id: id };
}

export async function listarEnviadasService(remitente_id) {
  return getNotificacionesEnviadas(remitente_id);
}

export async function eliminarNotificacionService(notificacion_id) {
  await deleteNotificacion(notificacion_id);
  return { message: 'Notificación eliminada' };
}

// ── Académico ──────────────────────────────────────────────────────────────

export async function misNotificacionesService(usuario_id) {
  return getNotificacionesParaAcademico(usuario_id);
}

export async function marcarNotificacionLeidaService({ notificacion_id, usuario_id, es_global }) {
  await marcarLeida({ notificacion_id, usuario_id, es_global });
  return { message: 'Marcada como leída' };
}

export async function contarNoLeidasService(usuario_id) {
  const count = await countNoLeidas(usuario_id);
  return { count };
}