import { pool } from "#src/config/db.js";

export const PasswordResetModel = {
  async crear(usuarioId, tokenHash, expiraEn) {
    await pool.execute(
      `INSERT INTO password_reset_token (usuario_id, token_hash, expira_en)
       VALUES (?, ?, ?)`,
      [usuarioId, tokenHash, expiraEn]
    );
  },

  async getVigentePorHash(tokenHash) {
    const [rows] = await pool.execute(
      `SELECT * FROM password_reset_token
       WHERE token_hash = ? AND usado = 0 AND expira_en > NOW()
       LIMIT 1`,
      [tokenHash]
    );
    return rows[0] || null;
  },

  async marcarUsadoYActualizarPassword(resetId, usuarioId, passwordHash) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.execute(
        `UPDATE password_reset_token SET usado = 1 WHERE reset_id = ?`,
        [resetId]
      );
      await conn.execute(
        `UPDATE usuario SET contrasena = ? WHERE usuario_id = ?`,
        [passwordHash, usuarioId]
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};