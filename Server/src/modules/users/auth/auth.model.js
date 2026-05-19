import { pool } from '../../../config/db.js';

// Busqueda de usuario por RUT, incluyendo el nombre del rol asociado.
export async function findUserByRut(rut) {
  const [rows] = await pool.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuario u
     JOIN rol r ON r.rol_id = u.rol_id
     WHERE u.rut = ?
     LIMIT 1`,
    [rut]
  );
  return rows[0] || null;
}