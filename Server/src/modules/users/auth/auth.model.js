import { pool } from '#src/config/db.js';

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

export async function findUserById(usuarioId) {
  const [rows] = await pool.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuario u
     JOIN rol r ON r.rol_id = u.rol_id
     WHERE u.usuario_id = ?
     LIMIT 1`,
    [usuarioId]
  );
  return rows[0] || null;
}

// Busqueda por correo organizacional para el login con Google.
// Trae también el estado de verificación del correo.
export async function findUserByCorreoOrganizacional(correo) {
  const [rows] = await pool.query(
    `SELECT u.*, r.nombre AS rol_nombre,
            co.correo AS correo_organizacional,
            co.verificado AS correo_verificado
     FROM usuario u
     JOIN rol r ON r.rol_id = u.rol_id
     JOIN correo_organizacional co ON co.usuario_id = u.usuario_id
     WHERE co.correo = ?
     LIMIT 1`,
    [correo]
  );
  return rows[0] || null;
}

// Asocia el google_id la primera vez que un usuario
// inicia sesión con Google.
export async function linkGoogleId(usuarioId, googleId) {
  await pool.query(
    `UPDATE usuario SET google_id = ? WHERE usuario_id = ?`,
    [googleId, usuarioId]
  );
}