import { pool } from "#src/config/db.js";

export const ConfiguracionModel = {
  async getAll() {
    const [rows] = await pool.query(`SELECT clave, valor FROM configuracion_sistema`);
    return rows;
  },

  async upsert(clave, valor) {
    await pool.query(
      `INSERT INTO configuracion_sistema (clave, valor) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
      [clave, valor]
    );
  },

  async getDominios() {
    const [rows] = await pool.query(
      `SELECT dominio_id, dominio FROM dominio_permitido ORDER BY dominio`
    );
    return rows;
  },

  async addDominio(dominio) {
    await pool.query(`INSERT INTO dominio_permitido (dominio) VALUES (?)`, [dominio]);
  },

  async deleteDominio(dominio_id) {
    const [result] = await pool.query(
      `DELETE FROM dominio_permitido WHERE dominio_id = ?`,
      [dominio_id]
    );
    if (result.affectedRows === 0) {
      const err = new Error("Dominio no encontrado");
      err.status = 404;
      throw err;
    }
  },
};