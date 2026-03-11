import { pool } from "../../config/db.js";

export async function listPublicacionesByUser(usuario_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      p.publicacion_id,
      p.usuario_id,
      p.categoria_id,
      c.nombre AS categoria_nombre,
      p.titulo_articulo,
      p.nombre_revista,
      p.ISSN,
      p.ano,
      p.autor_principal,
      p.autores,
      p.link_verificacion,
      google_drive_id,
      p.estado
    FROM publicaciones p
    JOIN categoria c ON c.categoria_id = p.categoria_id
    WHERE p.usuario_id = ?
    ORDER BY p.publicacion_id DESC
    `,
    [usuario_id]
  );
  return rows;
}

export async function getPublicacionById(publicacion_id) {
  const [rows] = await pool.query(
    `SELECT * FROM publicaciones WHERE publicacion_id = ? LIMIT 1`,
    [publicacion_id]
  );
  return rows[0] || null;
}

export async function createPublicacion(usuario_id, data) {
  const {
    categoria_id,
    titulo_articulo,
    nombre_revista,
    ISSN,
    ano,
    autor_principal,
    autores,
    link_verificacion,
    google_drive_id,
    estado,
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO publicaciones
      (usuario_id, categoria_id, titulo_articulo, nombre_revista, ISSN, ano, autor_principal, autores, link_verificacion, google_drive_id, estado)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      usuario_id,
      categoria_id,
      titulo_articulo,
      nombre_revista || null,
      ISSN || null,
      ano || null,
      autor_principal || null,
      autores || null,
      link_verificacion || null,
      google_drive_id || null,
      estado || null,
    ]
  );

  return result.insertId;
}

export async function updatePublicacion(publicacion_id, data) {
  const {
    categoria_id,
    titulo_articulo,
    nombre_revista,
    ISSN,
    ano,
    autor_principal,
    autores,
    link_verificacion,
    google_drive_id,
    estado,
  } = data;

  await pool.query(
    `
    UPDATE publicaciones
    SET categoria_id = ?,
        titulo_articulo = ?,
        nombre_revista = ?,
        ISSN = ?,
        ano = ?,
        autor_principal = ?,
        autores = ?,
        link_verificacion = ?,
        google_drive_id = ?,
        estado = ?
    WHERE publicacion_id = ?
    `,
    [
      categoria_id,
      titulo_articulo,
      nombre_revista || null,
      ISSN || null,
      ano || null,
      autor_principal || null,
      autores || null,
      link_verificacion || null,
      google_drive_id || null,
      estado || null,
      publicacion_id,
    ]
  );
}

export async function deletePublicacion(publicacion_id) {
  await pool.query(`DELETE FROM publicaciones WHERE publicacion_id = ?`, [publicacion_id]);
}
