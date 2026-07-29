import { Resend } from "resend";
import { pool } from "#src/config/db.js";
import { encolarEmail } from "#src/modules/queue/email.queue.js";

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
  await encolarEmail("verificacion", {
    usuarioId,
    correo,
    tipo: "verificacion",
    subject: "Verifica tu correo organizacional",
    html: `
      <p>Hola,</p>
      <p>Tu código de verificación para el Sistema de Postgrado en Historia UTA es:</p>
      <h2>${codigo}</h2>
      <p>Este código expira pronto. Si tú no solicitaste esto, ignora este correo.</p>
    `,
  });
}

export async function enviarCorreoRecuperacion({ usuarioId, correo, token }) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await encolarEmail("recuperacion", {
    usuarioId,
    correo,
    tipo: "recuperacion",
    subject: "Recupera tu contraseña",
    html: `
      <p>Hola,</p>
      <p>Solicitaste recuperar tu contraseña en el Sistema de Postgrado en Historia UTA.</p>
      <p><a href="${resetUrl}">Haz clic aquí para elegir una nueva contraseña</a></p>
      <p>Si no fuiste tú, ignora este correo — tu contraseña actual seguirá funcionando.</p>
    `,
  });
}