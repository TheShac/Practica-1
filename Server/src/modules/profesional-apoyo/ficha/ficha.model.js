import { pool } from '../../../config/db.js';

export async function getFichaByUsuario(usuarioId) {
  const limite = new Date().getFullYear() - 5;

  const [[publicaciones], [libros], [capitulos], [tesis], [investigaciones], [patentes]] =
    await Promise.all([
      pool.query(
        `SELECT p.*, c.nombre AS categoria
         FROM publicaciones p
         LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
         WHERE p.usuario_id = ? AND p.ano >= ? ORDER BY p.ano DESC`,
        [usuarioId, limite]
      ),
      pool.query(
        `SELECT * FROM libro WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
        [usuarioId, limite]
      ),
      pool.query(
        `SELECT * FROM cap_libro WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
        [usuarioId, limite]
      ),
      pool.query(
        `SELECT tesis_id, titulo_tesis, nombre_programa, institucion, ano, autor,
                rol_guia, nivel_programa, tesis_dirigida, link_verificacion
         FROM tesis WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
        [usuarioId, limite]
      ),
      pool.query(
        `SELECT investigacion_id, titulo, fuente_financiamiento, ano_adjudicacion,
                periodo_ejecucion, rol_proyecto, link_verificacion
         FROM investigacion WHERE usuario_id = ? AND ano_adjudicacion >= ?
         ORDER BY ano_adjudicacion DESC`,
        [usuarioId, limite]
      ),
      pool.query(
        `SELECT patente_id, inventores, nombre_patente, num_registro,
                fecha_solicitud, fecha_publicacion, estado, link_verificacion
         FROM patente WHERE usuario_id = ? AND YEAR(fecha_publicacion) >= ?
         ORDER BY fecha_publicacion DESC`,
        [usuarioId, limite]
      ),
    ]);

  return { publicaciones, libros, capitulos, tesis, investigaciones, patentes };
}

export async function getFichaByUsuarioMagister(usuarioId) {
  const limite = new Date().getFullYear() - 10;

  const [
    [publicaciones], [libros], [capitulos], [tesis],
    [investigaciones], [patentes], [intervenciones], [consultorias],
  ] = await Promise.all([
    pool.query(
      `SELECT p.*, c.nombre AS categoria
       FROM publicaciones p
       LEFT JOIN categoria c ON p.categoria_id = c.categoria_id
       WHERE p.usuario_id = ? AND p.ano >= ? ORDER BY p.ano DESC`,
      [usuarioId, limite]
    ),
    pool.query(
      `SELECT * FROM libro WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
      [usuarioId, limite]
    ),
    pool.query(
      `SELECT * FROM cap_libro WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
      [usuarioId, limite]
    ),
    pool.query(
      `SELECT tesis_id, titulo_tesis, nombre_programa, institucion, ano, autor,
              rol_guia, nivel_programa, tesis_dirigida, link_verificacion
       FROM tesis WHERE usuario_id = ? AND ano >= ? ORDER BY ano DESC`,
      [usuarioId, limite]
    ),
    pool.query(
      `SELECT investigacion_id, titulo, fuente_financiamiento, ano_adjudicacion,
              periodo_ejecucion, rol_proyecto, link_verificacion
       FROM investigacion WHERE usuario_id = ? AND ano_adjudicacion >= ?
       ORDER BY ano_adjudicacion DESC`,
      [usuarioId, limite]
    ),
    pool.query(
      `SELECT patente_id, inventores, nombre_patente, num_registro,
              fecha_solicitud, fecha_publicacion, estado, link_verificacion
       FROM patente WHERE usuario_id = ? AND YEAR(fecha_publicacion) >= ?
       ORDER BY fecha_publicacion DESC`,
      [usuarioId, limite]
    ),
    pool.query(
      `SELECT proyecto_id, titulo, fuente_financiamiento, ano_adjudicacion,
              periodo_ejecucion, rol_proyecto, link_verificacion
       FROM proyectos_intervencion WHERE usuario_id = ? AND ano_adjudicacion >= ?
       ORDER BY ano_adjudicacion DESC`,
      [usuarioId, limite]
    ),
    pool.query(
      `SELECT consultoria_id, titulo, institucion_contratante, ano_adjudicacion,
              periodo_ejecucion, objetivo, link_verificacion
       FROM consultorias WHERE usuario_id = ? AND ano_adjudicacion >= ?
       ORDER BY ano_adjudicacion DESC`,
      [usuarioId, limite]
    ),
  ]);

  return { publicaciones, libros, capitulos, tesis, investigaciones, patentes, intervenciones, consultorias };
}