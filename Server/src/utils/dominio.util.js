import { pool } from '#src/config/db.js';

export async function validarDominioPermitido(correo) {
  const dominio = correo.split('@')[1]?.toLowerCase();
  if (!dominio) return false;
  const [rows] = await pool.query(
    'SELECT 1 FROM dominio_permitido WHERE dominio = ?',
    [dominio]
  );
  return rows.length > 0;
}