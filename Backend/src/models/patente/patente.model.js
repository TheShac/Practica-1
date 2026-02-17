import { pool } from "../../config/db.js";

export async function getPatentesByUsuario(usuario_id) {
  const [rows] = await pool.query(
    `SELECT * FROM patente
     WHERE usuario_id = ?
     ORDER BY fecha_solicitud DESC`,
    [usuario_id]
  );

  return rows;
}

export async function createPatente(data) {
  const {
    usuario_id,
    inventores,
    nombre_patente,
    num_registro,
    fecha_solicitud,
    fecha_publicacion,
    estado,
    link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO patente
    (usuario_id, inventores, nombre_patente,
     num_registro, fecha_solicitud,
     fecha_publicacion, estado, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      inventores,
      nombre_patente,
      num_registro,
      fecha_solicitud,
      fecha_publicacion,
      estado,
      link_verificacion,
    ]
  );

  return result.insertId;
}

export async function updatePatente(id, data) {
  await pool.query(
    `UPDATE patente SET ?
     WHERE patente_id = ?`,
    [data, id]
  );
}

export async function deletePatente(id) {
  await pool.query(
    `DELETE FROM patente
     WHERE patente_id = ?`,
    [id]
  );
}
