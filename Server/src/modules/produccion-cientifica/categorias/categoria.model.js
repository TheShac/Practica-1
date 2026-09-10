import { pool } from '#src/config/db.js';

export async function getCategorias() {
  const [rows] = await pool.query(
    `SELECT categoria_id, nombre FROM categoria ORDER BY categoria_id ASC`
  );
  return rows;
}