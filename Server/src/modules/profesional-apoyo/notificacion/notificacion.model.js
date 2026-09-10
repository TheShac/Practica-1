import { pool } from '#src/config/db.js';

export async function createNotificacion({ remitente_id, asunto, mensaje, es_global, destinatarios = [], enviar_correo = false }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
 
    const [result] = await conn.query(
      `INSERT INTO notificacion (remitente_id, asunto, mensaje, es_global, enviar_correo)
       VALUES (?, ?, ?, ?, ?)`,
      [remitente_id, asunto, mensaje, es_global ? 1 : 0, enviar_correo ? 1 : 0]
    );
    const notificacion_id = result.insertId;
 
    if (!es_global && destinatarios.length > 0) {
      const values = destinatarios.map((uid) => [notificacion_id, uid]);
      await conn.query(
        `INSERT INTO notificacion_destinatario (notificacion_id, usuario_id) VALUES ?`,
        [values]
      );
    }
 
    await conn.commit();
    return notificacion_id;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getNotificacionesEnviadas(remitente_id) {
  const [rows] = await pool.query(
    `SELECT
       n.notificacion_id, n.asunto, n.mensaje, n.es_global, n.creado_en,
       n.enviar_correo, n.estado_envio, n.cantidad_destinatarios,
       n.cantidad_enviados, n.cantidad_errores,
       CASE
         WHEN n.es_global = 1 THEN (SELECT COUNT(*) FROM usuario WHERE rol_id = 3)
         ELSE COUNT(nd.usuario_id)
       END AS total_destinatarios,
       CASE
         WHEN n.es_global = 1 THEN (
           SELECT COUNT(*) FROM notificacion_global_leido ngl
           WHERE ngl.notificacion_id = n.notificacion_id
         )
         ELSE SUM(COALESCE(nd.leido, 0))
       END AS total_leidos
     FROM notificacion n
     LEFT JOIN notificacion_destinatario nd ON nd.notificacion_id = n.notificacion_id
     WHERE n.remitente_id = ?
     GROUP BY n.notificacion_id
     ORDER BY n.creado_en DESC`,
    [remitente_id]
  );
  return rows;
}

export async function deleteNotificacion(notificacion_id, remitente_id) {
  const [result] = await pool.query(
    `DELETE FROM notificacion WHERE notificacion_id = ? AND remitente_id = ?`,
    [notificacion_id, remitente_id]
  );
  if (result.affectedRows === 0) {
    const err = new Error('Notificación no encontrada o no autorizado');
    err.status = 404;
    throw err;
  }
}

export async function getNotificacionesParaAcademico(usuario_id) {
  const [globales] = await pool.query(
    `SELECT
       n.notificacion_id, n.asunto, n.mensaje, n.creado_en,
       1 AS es_global,
       CASE WHEN ngl.id IS NOT NULL THEN 1 ELSE 0 END AS leido,
       ngl.leido_en,
       CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS remitente_nombre
     FROM notificacion n
     JOIN usuario u ON u.usuario_id = n.remitente_id
     LEFT JOIN notificacion_global_leido ngl
           ON ngl.notificacion_id = n.notificacion_id AND ngl.usuario_id = ?
     WHERE n.es_global = 1
     ORDER BY n.creado_en DESC`,
    [usuario_id]
  );
 
  const [especificas] = await pool.query(
    `SELECT
       n.notificacion_id, n.asunto, n.mensaje, n.creado_en,
       0 AS es_global, nd.leido, nd.leido_en,
       CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS remitente_nombre
     FROM notificacion_destinatario nd
     JOIN notificacion n ON n.notificacion_id = nd.notificacion_id
     JOIN usuario u      ON u.usuario_id      = n.remitente_id
     WHERE nd.usuario_id = ?
     ORDER BY n.creado_en DESC`,
    [usuario_id]
  );
 
  return [...globales, ...especificas].sort(
    (a, b) => new Date(b.creado_en) - new Date(a.creado_en)
  );
}

export async function marcarLeida({ notificacion_id, usuario_id, es_global }) {
  if (es_global) {
    await pool.query(
      `INSERT IGNORE INTO notificacion_global_leido (notificacion_id, usuario_id) VALUES (?, ?)`,
      [notificacion_id, usuario_id]
    );
  } else {
    await pool.query(
      `UPDATE notificacion_destinatario
       SET leido = 1, leido_en = NOW()
       WHERE notificacion_id = ? AND usuario_id = ?`,
      [notificacion_id, usuario_id]
    );
  }
}

export async function countNoLeidas(usuario_id) {
  const [[{ globales }]] = await pool.query(
    `SELECT COUNT(*) AS globales
     FROM notificacion n
     WHERE n.es_global = 1
       AND NOT EXISTS (
         SELECT 1 FROM notificacion_global_leido ngl
         WHERE ngl.notificacion_id = n.notificacion_id AND ngl.usuario_id = ?
       )`,
    [usuario_id]
  );
  const [[{ especificas }]] = await pool.query(
    `SELECT COUNT(*) AS especificas
     FROM notificacion_destinatario
     WHERE usuario_id = ? AND leido = 0`,
    [usuario_id]
  );
  return Number(globales) + Number(especificas);
}

export async function getDestinatariosConCorreoVerificado({ es_global, destinatarios = [] }) {
  if (es_global) {
    const [rows] = await pool.query(
      `SELECT u.usuario_id, co.correo
       FROM usuario u
       JOIN correo_organizacional co ON co.usuario_id = u.usuario_id
       WHERE u.rol_id = 3 AND co.verificado = 1`
    );
    return rows;
  }
 
  if (destinatarios.length === 0) return [];
 
  const [rows] = await pool.query(
    `SELECT u.usuario_id, co.correo
     FROM usuario u
     JOIN correo_organizacional co ON co.usuario_id = u.usuario_id
     WHERE u.usuario_id IN (?) AND co.verificado = 1`,
    [destinatarios]
  );
  return rows;
}

export async function iniciarEnvioCorreo(notificacion_id, cantidad_destinatarios) {
  const estado_envio = cantidad_destinatarios > 0 ? 'procesando' : 'completado';
  await pool.query(
    `UPDATE notificacion SET cantidad_destinatarios = ?, estado_envio = ? WHERE notificacion_id = ?`,
    [cantidad_destinatarios, estado_envio, notificacion_id]
  );
}

export async function registrarResultadoEnvioCorreo(notificacion_id, resultado) {
  const campo = resultado === 'enviado' ? 'cantidad_enviados' : 'cantidad_errores';
 
  await pool.query(
    `UPDATE notificacion SET ${campo} = ${campo} + 1 WHERE notificacion_id = ?`,
    [notificacion_id]
  );
 
  const [rows] = await pool.query(
    `SELECT cantidad_destinatarios, cantidad_enviados, cantidad_errores
     FROM notificacion WHERE notificacion_id = ?`,
    [notificacion_id]
  );
  const fila = rows[0];
  if (!fila) return;
 
  const totalProcesados = fila.cantidad_enviados + fila.cantidad_errores;
  if (totalProcesados >= fila.cantidad_destinatarios) {
    const nuevoEstado = fila.cantidad_errores > 0 ? 'con_errores' : 'completado';
    await pool.query(
      `UPDATE notificacion SET estado_envio = ? WHERE notificacion_id = ?`,
      [nuevoEstado, notificacion_id]
    );
  }
}

export async function getEsGlobal(notificacion_id) {
  const [rows] = await pool.query(
    `SELECT es_global FROM notificacion WHERE notificacion_id = ?`,
    [notificacion_id]
  );
  return rows[0]?.es_global ?? null;
}

export async function getDetalleLectura(notificacion_id, es_global) {
  if (Number(es_global) === 1) {
    const [rows] = await pool.query(
      `SELECT u.usuario_id, CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre,
              CASE WHEN ngl.id IS NOT NULL THEN 1 ELSE 0 END AS leido, ngl.leido_en
       FROM usuario u
       LEFT JOIN notificacion_global_leido ngl
              ON ngl.notificacion_id = ? AND ngl.usuario_id = u.usuario_id
       WHERE u.rol_id = 3
       ORDER BY leido ASC, nombre ASC`,
      [notificacion_id]
    );
    return rows;
  }
 
  const [rows] = await pool.query(
    `SELECT u.usuario_id, CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre,
            nd.leido, nd.leido_en
     FROM notificacion_destinatario nd
     JOIN usuario u ON u.usuario_id = nd.usuario_id
     WHERE nd.notificacion_id = ?
     ORDER BY nd.leido ASC, nombre ASC`,
    [notificacion_id]
  );
  return rows;
}