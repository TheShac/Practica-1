import { pool } from "#src/config/db.js";
import { obtenerCuotaActual } from "#src/modules/queue/quota.service.js";
import { emailQueue } from "#src/modules/queue/email.queue.js";

export async function obtenerDashboardCorreos() {
  const cuota = await obtenerCuotaActual();

  const [rowsFallidos] = await pool.query(
    `SELECT COUNT(*) AS total FROM email_logs WHERE estado = 'error'`
  );

  const counts = await emailQueue.getJobCounts("waiting", "active", "delayed");
  const pendientes = counts.waiting + counts.active + counts.delayed;

  const [porTipo] = await pool.query(
    `SELECT tipo, COUNT(*) AS total
     FROM email_logs
     WHERE estado = 'enviado'
     GROUP BY tipo`
  );

  const [porDia] = await pool.query(
    `SELECT DATE(creado_en) AS dia, COUNT(*) AS total
     FROM email_logs
     WHERE estado = 'enviado' AND creado_en >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
     GROUP BY dia
     ORDER BY dia`
  );

  const [porMes] = await pool.query(
    `SELECT DATE_FORMAT(creado_en, '%Y-%m') AS mes, COUNT(*) AS total
     FROM email_logs
     WHERE estado = 'enviado'
     GROUP BY mes
     ORDER BY mes`
  );

  const [historial] = await pool.query(
    `SELECT  logs_id, usuario_id, correo, tipo, estado, error, creado_en
     FROM email_logs
     ORDER BY creado_en DESC
     LIMIT 50`
  );

  return {
    hoy: cuota.diario,
    mes: cuota.mensual,
    fallidos: rowsFallidos[0].total,
    pendientes,
    porTipo,
    porDia,
    porMes,
    historial,
  };
}

export async function obtenerDashboardNotificaciones() {
  const [rowsTotal] = await pool.query(`SELECT COUNT(*) AS total FROM notificacion`);

  const [rowsHoy] = await pool.query(
    `SELECT COUNT(*) AS total FROM notificacion WHERE DATE(creado_en) = CURDATE()`
  );

  const [rowsSoloWeb] = await pool.query(
    `SELECT COUNT(*) AS total FROM notificacion WHERE enviar_correo = 0`
  );

  const [rowsConCorreo] = await pool.query(
    `SELECT COUNT(*) AS total FROM notificacion WHERE enviar_correo = 1`
  );

  const [porRemitente] = await pool.query(
    `SELECT CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS remitente, COUNT(*) AS total
     FROM notificacion n
     JOIN usuario u ON u.usuario_id = n.remitente_id
     GROUP BY n.remitente_id
     ORDER BY total DESC`
  );

  const [recientes] = await pool.query(
    `SELECT n.notificacion_id, n.asunto, n.es_global, n.enviar_correo, n.estado_envio,
            n.cantidad_destinatarios, n.cantidad_enviados, n.cantidad_errores, n.creado_en,
            CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS remitente
     FROM notificacion n
     JOIN usuario u ON u.usuario_id = n.remitente_id
     ORDER BY n.creado_en DESC
     LIMIT 20`
  );

  return {
    total: rowsTotal[0].total,
    hoy: rowsHoy[0].total,
    soloWeb: rowsSoloWeb[0].total,
    conCorreo: rowsConCorreo[0].total,
    porRemitente,
    recientes,
  };
}