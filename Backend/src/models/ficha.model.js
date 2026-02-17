import { pool } from "../config/db.js";

export async function getFichaByUsuario(usuarioId) {
  const currentYear = new Date().getFullYear();
  const limite = currentYear - 5;

  // PUBLICACIONES
  const [publicaciones] = await pool.query(
    `
    SELECT p.*, c.nombre AS categoria
    FROM publicaciones p
    LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
    WHERE p.usuario_id = ?
    AND p.ano >= ?
    ORDER BY p.ano DESC
    `,
    [usuarioId, limite]
  );

  // LIBROS
  const [libros] = await pool.query(
    `
    SELECT *
    FROM libro
    WHERE usuario_id = ?
    AND ano >= ?
    ORDER BY ano DESC
    `,
    [usuarioId, limite]
  );

  // CAPÍTULOS
  const [capitulos] = await pool.query(
    `
    SELECT *
    FROM cap_libro
    WHERE usuario_id = ?
    AND ano >= ?
    ORDER BY ano DESC
    `,
    [usuarioId, limite]
  );

  // TESIS
  const [tesis] = await pool.query(
    `
    SELECT *
    FROM tesis
    WHERE usuario_id = ?
    AND ano >= ?
    ORDER BY ano DESC
    `,
    [usuarioId, limite]
  );

  // INVESTIGACIONES
  const [investigaciones] = await pool.query(
    `
    SELECT *
    FROM investigacion
    WHERE usuario_id = ?
    AND ano_adjudicacion >= ?
    ORDER BY ano_adjudicacion DESC
    `,
    [usuarioId, limite]
  );

  // PATENTES
  const [patentes] = await pool.query(
    `
    SELECT *
    FROM patente
    WHERE usuario_id = ?
    AND YEAR(fecha_publicacion) >= ?
    ORDER BY fecha_publicacion DESC
    `,
    [usuarioId, limite]
  );

  return {
    publicaciones,
    libros,
    capitulos,
    tesis,
    investigaciones,
    patentes,
  };
}
