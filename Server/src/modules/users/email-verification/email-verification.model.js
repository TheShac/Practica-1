import { pool } from "#src/config/db.js";

export const EmailVerificationModel = {
  async getByUsuarioId(usuarioId) {
    const [rows] = await pool.execute(
      "SELECT * FROM correo_organizacional WHERE usuario_id = ?",
      [usuarioId]
    );
    return rows[0] || null;
  },

  async getByCorreo(correo) {
    const [rows] = await pool.execute(
      "SELECT * FROM correo_organizacional WHERE correo = ?",
      [correo]
    );
    return rows[0] || null;
  },

  async upsert(usuarioId, correo) {
    const existente = await this.getByUsuarioId(usuarioId);
    if (existente) {
      await pool.execute(
        `UPDATE correo_organizacional
         SET correo = ?, verificado = 0, verificado_en = NULL, actualizado_en = NOW()
         WHERE usuario_id = ?`,
        [correo, usuarioId]
      );
    } else {
      await pool.execute(
        `INSERT INTO correo_organizacional (usuario_id, correo, verificado)
         VALUES (?, ?, 0)`,
        [usuarioId, correo]
      );
    }
  },

  async marcarVerificado(usuarioId) {
    await pool.execute(
      `UPDATE correo_organizacional
       SET verificado = 1, verificado_en = NOW()
       WHERE usuario_id = ?`,
      [usuarioId]
    );
  },
};

export const VerificacionCodigoModel = {
  async crear(usuarioId, codigoHash, expiraEn, intentosReenvio = 0) {
    await pool.execute(
      `INSERT INTO verificacion_correo (usuario_id, codigo_hash, expira_en, intentos_reenvio)
       VALUES (?, ?, ?, ?)`,
      [usuarioId, codigoHash, expiraEn, intentosReenvio]
    );
  },

  // Se asume un único código "vigente" por usuario: el más reciente.
  // reenviarCodigo() siempre borra el anterior antes de crear uno nuevo,
  // así que en la práctica solo debería existir 0 o 1 fila por usuario.
  async getVigente(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT * FROM verificacion_correo
       WHERE usuario_id = ?
       ORDER BY creado_en DESC
       LIMIT 1`,
      [usuarioId]
    );
    return rows[0] || null;
  },

  async eliminarPorUsuario(usuarioId) {
    await pool.execute("DELETE FROM verificacion_correo WHERE usuario_id = ?", [usuarioId]);
  },
};