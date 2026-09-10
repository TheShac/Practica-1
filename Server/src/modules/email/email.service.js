import { Resend } from "resend";
import { pool } from "#src/config/db.js";
import { encolarEmail } from "#src/modules/queue/email.queue.js";
import { renderVerificacion, renderRecuperarPassword, renderNotificacion, renderBienvenida, } from "#src/emails/renderEmails.jsx";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function obtenerRemitente() {
  const [rows] = await pool.execute(
    "SELECT clave, valor FROM configuracion_sistema WHERE clave IN ('remitente_correo','remitente_nombre')"
  );
  const config = Object.fromEntries(rows.map((r) => [r.clave, r.valor]));
  const correo = config.remitente_correo || "onboarding@resend.dev";
  const nombre = config.remitente_nombre || "Postgrado en Historia UTA";
  return `${nombre} <${correo}>`;
}

export async function registrarLog({ usuarioId, correo, tipo, estado, error = null, resendId = null, notificacionId = null }) {
  await pool.execute(
    `INSERT INTO email_logs (usuario_id, correo, tipo, estado, error, resend_id, notificacion_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [usuarioId ?? null, correo, tipo, estado, error, resendId, notificacionId]
  );
}

export async function enviarCorreoCrudo({ usuarioId, correo, tipo, subject, html }) {
  const from = await obtenerRemitente();
 
  try {
    const { data, error } = await resend.emails.send({ from, to: correo, subject, html });
 
    if (error) {
      await registrarLog({ usuarioId, correo, tipo, estado: "error", error: error.message });
      throw new Error(`No se pudo enviar el correo de ${tipo}.`);
    }
 
    await registrarLog({ usuarioId, correo, tipo, estado: "enviado", resendId: data?.id });
  } catch (err) {
    if (!err.message?.startsWith("No se pudo enviar")) {
      await registrarLog({ usuarioId, correo, tipo, estado: "error", error: err.message });
    }
    throw err;
  }
}

export async function enviarCorreoVerificacion({ usuarioId, correo, codigo }) {
  const html = await renderVerificacion({ codigo });
 
  await encolarEmail("verificacion", {
    usuarioId,
    correo,
    tipo: "verificacion",
    subject: "Verifica tu correo organizacional",
    html,
  });
}

export async function enviarCorreoRecuperacion({ usuarioId, correo, token }) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = await renderRecuperarPassword({ resetUrl });
 
  await encolarEmail("recuperacion", {
    usuarioId,
    correo,
    tipo: "recuperacion",
    subject: "Recupera tu contraseña",
    html,
  });
}

export async function enviarCorreoNotificacion({ usuarioId, correo, asunto, mensaje, notificacionId }) {
  const html = await renderNotificacion({ asunto, mensaje });
 
  await encolarEmail("notificacion", {
    usuarioId,
    correo,
    tipo: "notificacion",
    subject: asunto,
    html,
    notificacionId,
  });
}

export async function enviarCorreoBienvenida({ usuarioId, correo, nombre }) {
  const { html, text } = await renderBienvenida({ nombre });
 
  await encolarEmail("bienvenida", {
    usuarioId,
    correo,
    tipo: "bienvenida",
    subject: "Bienvenido/a al Sistema de Postgrado en Historia UTA",
    html,
    text,
  });
}