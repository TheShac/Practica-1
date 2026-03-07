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
    SELECT 
      tesis_id,
      titulo_tesis,
      nombre_programa,
      institucion,
      ano,
      autor,
      rol_guia,
      nivel_programa,
      tesis_dirigida,
      link_verificacion
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
    SELECT 
      investigacion_id,
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion
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
    SELECT 
      patente_id,
      inventores,
      nombre_patente,
      num_registro,
      fecha_solicitud,
      fecha_publicacion,
      estado,
      link_verificacion
    FROM patente
    WHERE usuario_id = ?
    AND YEAR(fecha_publicacion) >= ?
    ORDER BY fecha_publicacion DESC
    `,
    [usuarioId, limite]
  );

  return { publicaciones, libros, capitulos, tesis, investigaciones, patentes };
}

export async function getFichaByUsuarioMagister(usuarioId) {
  const currentYear = new Date().getFullYear();
  const limite = currentYear - 10;

  const [publicaciones] = await pool.query(
    `SELECT p.*, c.nombre AS categoria
     FROM publicaciones p
     LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
     WHERE p.usuario_id = ? AND p.ano >= ?
     ORDER BY p.ano DESC`,
    [usuarioId, limite]
  );

  const [libros] = await pool.query(
    `SELECT * FROM libro WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
    [usuarioId, limite]
  );

  const [capitulos] = await pool.query(
    `SELECT * FROM cap_libro WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
    [usuarioId, limite]
  );

  const [tesis] = await pool.query(
    `SELECT tesis_id, titulo_tesis, nombre_programa, institucion, ano, autor,
            rol_guia, nivel_programa, tesis_dirigida, link_verificacion
     FROM tesis WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
    [usuarioId, limite]
  );

  const [investigaciones] = await pool.query(
    `SELECT investigacion_id, titulo, fuente_financiamiento, ano_adjudicacion,
            periodo_ejecucion, rol_proyecto, link_verificacion
     FROM investigacion WHERE usuario_id = ? AND ano_adjudicacion >= ?
     ORDER BY ano_adjudicacion DESC`,
    [usuarioId, limite]
  );

  const [patentes] = await pool.query(
    `SELECT patente_id, inventores, nombre_patente, num_registro,
            fecha_solicitud, fecha_publicacion, estado, link_verificacion
     FROM patente WHERE usuario_id = ? AND YEAR(fecha_publicacion) >= ?
     ORDER BY fecha_publicacion DESC`,
    [usuarioId, limite]
  );

  const [intervenciones] = await pool.query(
    `SELECT proyecto_id, titulo, fuente_financiamiento, ano_adjudicacion,
            periodo_ejecucion, rol_proyecto, link_verificacion
     FROM proyectos_intervencion WHERE usuario_id = ? AND ano_adjudicacion >= ?
     ORDER BY ano_adjudicacion DESC`,
    [usuarioId, limite]
  );

  const [consultorias] = await pool.query(
    `SELECT consultoria_id, titulo, institucion_contratante, ano_adjudicacion,
            periodo_ejecucion, objetivo, link_verificacion
     FROM consultorias WHERE usuario_id = ? AND ano_adjudicacion >= ?
     ORDER BY ano_adjudicacion DESC`,
    [usuarioId, limite]
  );

  return {
    publicaciones, libros, capitulos, tesis,
    investigaciones, patentes, intervenciones, consultorias,
  };
}