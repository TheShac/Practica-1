import { pool } from "../../config/db.js";

// ── Secretaria: crear notificación ───────────────────────────────────────────
export async function createNotificacion({ remitente_id, asunto, mensaje, es_global, destinatarios = [] }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO notificacion (remitente_id, asunto, mensaje, es_global)
       VALUES (?, ?, ?, ?)`,
      [remitente_id, asunto, mensaje, es_global ? 1 : 0]
    );

    const notificacion_id = result.insertId;

    // Si no es global, insertar destinatarios específicos
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

// ── Secretaria: listar notificaciones enviadas ────────────────────────────────
export async function getNotificacionesEnviadas(remitente_id) {
  const [rows] = await pool.query(
    `SELECT 
       n.notificacion_id,
       n.asunto,
       n.mensaje,
       n.es_global,
       n.creado_en,
       COUNT(nd.usuario_id)                          AS total_destinatarios,
       SUM(COALESCE(nd.leido, 0))                    AS total_leidos
     FROM notificacion n
     LEFT JOIN notificacion_destinatario nd ON nd.notificacion_id = n.notificacion_id
     WHERE n.remitente_id = ?
     GROUP BY n.notificacion_id
     ORDER BY n.creado_en DESC`,
    [remitente_id]
  );
  return rows;
}

// ── Secretaria: eliminar notificación ────────────────────────────────────────
export async function deleteNotificacion(notificacion_id) {
  await pool.query(`DELETE FROM notificacion WHERE notificacion_id = ?`, [notificacion_id]);
}

// ── Académico: obtener sus notificaciones ─────────────────────────────────────
export async function getNotificacionesParaAcademico(usuario_id) {
  // Notificaciones globales
  const [globales] = await pool.query(
    `SELECT
       n.notificacion_id,
       n.asunto,
       n.mensaje,
       n.creado_en,
       1                                             AS es_global,
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

  // Notificaciones específicas
  const [especificas] = await pool.query(
    `SELECT
       n.notificacion_id,
       n.asunto,
       n.mensaje,
       n.creado_en,
       0                                             AS es_global,
       nd.leido,
       nd.leido_en,
       CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS remitente_nombre
     FROM notificacion_destinatario nd
     JOIN notificacion n  ON n.notificacion_id  = nd.notificacion_id
     JOIN usuario u       ON u.usuario_id       = n.remitente_id
     WHERE nd.usuario_id = ?
     ORDER BY n.creado_en DESC`,
    [usuario_id]
  );

  // Combinar y ordenar por fecha
  return [...globales, ...especificas].sort(
    (a, b) => new Date(b.creado_en) - new Date(a.creado_en)
  );
}

// ── Académico: marcar como leída ──────────────────────────────────────────────
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

// ── Académico: contar no leídas (para badge) ──────────────────────────────────
export async function countNoLeidas(usuario_id) {
  const [[{ globales }]] = await pool.query(
    `SELECT COUNT(*) AS globales
     FROM notificacion n
     WHERE n.es_global = 1
       AND NOT EXISTS (
         SELECT 1 FROM notificacion_global_leido ngl
         WHERE ngl.notificacion_id = n.notificacion_id
           AND ngl.usuario_id = ?
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