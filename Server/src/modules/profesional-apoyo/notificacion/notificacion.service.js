import {
  createNotificacion, getNotificacionesEnviadas, deleteNotificacion,
  getNotificacionesParaAcademico, marcarLeida, countNoLeidas,
  getDestinatariosConCorreoVerificado, iniciarEnvioCorreo,
  getEsGlobal, getDetalleLectura,
} from './notificacion.model.js';
import { sseManager } from '#src/core/sse.manager.js';
import { enviarCorreoNotificacion } from '#src/modules/email/email.service.js';

// ── Secretaria ─────────────────────────────────────────────────────────────

export async function enviarNotificacionService({
  remitente_id, asunto, mensaje, es_global, destinatarios = [], enviar_correo = false,
}) {
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
 
  const id = await createNotificacion({ remitente_id, asunto, mensaje, es_global, destinatarios, enviar_correo });
 
  // ── Emitir SSE a los destinatarios conectados (sin cambios) ────────────
  const payload = { notificacion_id: id, asunto, mensaje };
 
  if (es_global) {
    sseManager.emitirATodos(payload);
  } else {
    for (const usuario_id of destinatarios) {
      sseManager.emitir(usuario_id, payload);
    }
  }

  if (enviar_correo) {
    const destinatariosConCorreo = await getDestinatariosConCorreoVerificado({ es_global, destinatarios });
    await iniciarEnvioCorreo(id, destinatariosConCorreo.length);
 
    for (const { usuario_id, correo } of destinatariosConCorreo) {
      await enviarCorreoNotificacion({
        usuarioId: usuario_id,
        correo,
        asunto,
        mensaje,
        notificacionId: id,
      });
    }
  }
 
  return { notificacion_id: id };
}

export async function listarEnviadasService(remitente_id) {
  return getNotificacionesEnviadas(remitente_id);
}

export async function eliminarNotificacionService(notificacion_id, remitente_id) {
  await deleteNotificacion(notificacion_id, remitente_id);
  return { message: 'Notificación eliminada' };
}

export async function detalleLecturaService(notificacion_id) {
  const es_global = await getEsGlobal(notificacion_id);
  if (es_global === null) {
    const err = new Error('Notificación no encontrada');
    err.status = 404;
    throw err;
  }
  return getDetalleLectura(notificacion_id, es_global);
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

// ── SSE ────────────────────────────────────────────────────────────────────
 
export function conectarSSEService(usuario_id, res) {
  // Headers necesarios para SSE
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();
 
  // Ping cada 30s para mantener la conexión viva
  const ping = setInterval(() => {
    res.write('event: ping\ndata: {}\n\n');
  }, 30_000);
 
  sseManager.agregar(usuario_id, res);
 
  // Limpiar al desconectarse
  res.on('close', () => {
    clearInterval(ping);
    sseManager.eliminar(usuario_id);
  });
}