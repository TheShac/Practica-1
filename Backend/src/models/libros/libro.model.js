import { pool } from "../../config/db.js";

export async function listLibrosByUser(usuario_id) {
  const [rows] = await pool.query(
    `
    SELECT
      libro_id,
      usuario_id,
      nombre_libro,
      editorial,
      lugar,
      ano,
      autor_principal,
      autores,
      link_verificacion,
      estado
    FROM libro
    WHERE usuario_id = ?
    ORDER BY libro_id DESC
    `,
    [usuario_id]
  );
  return rows;
}

export async function getLibroById(libro_id) {
  const [rows] = await pool.query(
    `SELECT * FROM libro WHERE libro_id = ? LIMIT 1`,
    [libro_id]
  );
  return rows[0] || null;
}

export async function createLibro(usuario_id, data) {
  const {
    nombre_libro,
    editorial,
    lugar,
    ano,
    autor_principal,
    autores,
    link_verificacion,
    estado,
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO libro
      (usuario_id, nombre_libro, editorial, lugar, ano, autor_principal, autores, link_verificacion, estado)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      usuario_id,
      nombre_libro,
      editorial || null,
      lugar || null,
      ano || null,
      autor_principal || null,
      autores || null,
      link_verificacion || null,
      estado || null,
    ]
  );

  return result.insertId;
}

export async function updateLibro(libro_id, data) {
  const {
    nombre_libro,
    editorial,
    lugar,
    ano,
    autor_principal,
    autores,
    link_verificacion,
    estado,
  } = data;

  await pool.query(
    `
    UPDATE libro
    SET nombre_libro = ?,
        editorial = ?,
        lugar = ?,
        ano = ?,
        autor_principal = ?,
        autores = ?,
        link_verificacion = ?,
        estado = ?
    WHERE libro_id = ?
    `,
    [
      nombre_libro,
      editorial || null,
      lugar || null,
      ano || null,
      autor_principal || null,
      autores || null,
      link_verificacion || null,
      estado || null,
      libro_id,
    ]
  );
}

export async function deleteLibro(libro_id) {
  await pool.query(`DELETE FROM libro WHERE libro_id = ?`, [libro_id]);
}
