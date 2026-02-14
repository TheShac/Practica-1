import { pool } from "../../config/db.js";

export async function listCapLibrosByUser(usuario_id) {
  const [rows] = await pool.query(
    `
    SELECT
      cap_id,
      usuario_id,
      nombre_capitulo,
      nombre_libro,
      editorial,
      lugar,
      ano,
      autor_principal,
      autores,
      link_verificacion,
      estado
    FROM cap_libro
    WHERE usuario_id = ?
    ORDER BY cap_id DESC
    `,
    [usuario_id]
  );
  return rows;
}

export async function getCapLibroById(cap_id) {
  const [rows] = await pool.query(
    `SELECT * FROM cap_libro WHERE cap_id = ? LIMIT 1`,
    [cap_id]
  );
  return rows[0] || null;
}

export async function createCapLibro(usuario_id, data) {
  const {
    nombre_capitulo,
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
    INSERT INTO cap_libro
      (usuario_id, nombre_capitulo, nombre_libro, editorial, lugar, ano, autor_principal, autores, link_verificacion, estado)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      usuario_id,
      nombre_capitulo,
      nombre_libro || null,
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

export async function updateCapLibro(cap_id, data) {
  const {
    nombre_capitulo,
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
    UPDATE cap_libro
    SET nombre_capitulo = ?,
        nombre_libro = ?,
        editorial = ?,
        lugar = ?,
        ano = ?,
        autor_principal = ?,
        autores = ?,
        link_verificacion = ?,
        estado = ?
    WHERE cap_id = ?
    `,
    [
      nombre_capitulo,
      nombre_libro || null,
      editorial || null,
      lugar || null,
      ano || null,
      autor_principal || null,
      autores || null,
      link_verificacion || null,
      estado || null,
      cap_id,
    ]
  );
}

export async function deleteCapLibro(cap_id) {
  await pool.query(`DELETE FROM cap_libro WHERE cap_id = ?`, [cap_id]);
}
