import {
  createNotificacion,
  getNotificacionesEnviadas,
  deleteNotificacion,
  getNotificacionesParaAcademico,
  marcarLeida,
  countNoLeidas,
} from "../../models/profesional-apoyo/notificacion.model.js";

// ── Secretaria ────────────────────────────────────────────────────────────────

export async function enviarNotificacion(req, res) {
  try {
    const remitente_id = req.user.usuario_id;
    const { asunto, mensaje, es_global, destinatarios = [] } = req.body;

    if (!asunto?.trim() || !mensaje?.trim()) {
      return res.status(400).json({ message: "Asunto y mensaje son obligatorios" });
    }

    if (!es_global && destinatarios.length === 0) {
      return res.status(400).json({ message: "Debes seleccionar al menos un destinatario" });
    }

    const id = await createNotificacion({ remitente_id, asunto, mensaje, es_global, destinatarios });
    res.status(201).json({ notificacion_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error enviando notificación" });
  }
}

export async function listarEnviadas(req, res) {
  try {
    const remitente_id = req.user.usuario_id;
    const rows = await getNotificacionesEnviadas(remitente_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando notificaciones" });
  }
}

export async function eliminarNotificacion(req, res) {
  try {
    const { id } = req.params;
    await deleteNotificacion(id);
    res.json({ message: "Notificación eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando notificación" });
  }
}

// ── Académico ─────────────────────────────────────────────────────────────────

export async function misNotificaciones(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const rows = await getNotificacionesParaAcademico(usuario_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo notificaciones" });
  }
}

export async function marcarNotificacionLeida(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;
    const { es_global } = req.body;

    await marcarLeida({ notificacion_id: id, usuario_id, es_global });
    res.json({ message: "Marcada como leída" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marcando notificación" });
  }
}

export async function contarNoLeidas(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const count = await countNoLeidas(usuario_id);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error contando notificaciones" });
  }
}