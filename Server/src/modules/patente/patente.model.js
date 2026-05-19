import { pool } from '../../config/db.js';

export async function getPatentesByUsuario(usuario_id) {
  const [rows] = await pool.query(
    `SELECT * FROM patente
     WHERE usuario_id = ?
     ORDER BY fecha_solicitud DESC`,
    [usuario_id]
  );
  return rows;
}

export async function getPatenteById(patente_id) {
  const [rows] = await pool.query(
    `SELECT * FROM patente WHERE patente_id = ? LIMIT 1`,
    [patente_id]
  );
  return rows[0] || null;
}

export async function createPatente(data) {
  const {
    usuario_id, inventores, nombre_patente, num_registro,
    fecha_solicitud, fecha_publicacion, estado, link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO patente
       (usuario_id, inventores, nombre_patente, num_registro,
        fecha_solicitud, fecha_publicacion, estado, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      inventores        || null,
      nombre_patente,
      num_registro      || null,
      fecha_solicitud   || null,
      fecha_publicacion || null,
      estado            || null,
      link_verificacion || null,
    ]
  );
  return result.insertId;
}

export async function updatePatente(patente_id, data) {
  const {
    inventores, nombre_patente, num_registro,
    fecha_solicitud, fecha_publicacion, estado, link_verificacion,
  } = data;

  await pool.query(
    `UPDATE patente
     SET inventores        = ?,
         nombre_patente    = ?,
         num_registro      = ?,
         fecha_solicitud   = ?,
         fecha_publicacion = ?,
         estado            = ?,
         link_verificacion = ?
     WHERE patente_id = ?`,
    [
      inventores        || null,
      nombre_patente,
      num_registro      || null,
      fecha_solicitud   || null,
      fecha_publicacion || null,
      estado            || null,
      link_verificacion || null,
      patente_id,
    ]
  );
}

export async function deletePatente(patente_id) {
  await pool.query(
    `DELETE FROM patente WHERE patente_id = ?`,
    [patente_id]
  );
}