import { pool } from '../../../config/db.js';

export async function getReporteGeneral(programa_id) {
  const [rows] = await pool.query(`
    SELECT
      u.usuario_id, u.primer_nombre, u.primer_apellido, u.ano_ingreso,
      ra.tipo_academico,
      COALESCE(rm.total_wos_scopus_5_anios, 0) AS total_wos_scopus_5_anios,
      COALESCE(rm.total_scielo_5_anios,     0) AS total_scielo_5_anios,
      COALESCE(rm.otros_articulos,          0) AS otros_articulos,
      COALESCE(rm.libros_area,              0) AS libros_area,
      COALESCE(rm.libros_otro,              0) AS libros_otro,
      COALESCE(rm.cap_area,                 0) AS cap_area,
      COALESCE(rm.cap_otro,                 0) AS cap_otro,
      COALESCE(rm.edicion_area,             0) AS edicion_area,
      COALESCE(rm.edicion_otro,             0) AS edicion_otro,
      COALESCE(rm.proyectos_fondecyt,       0) AS proyectos_fondecyt,
      COALESCE(rm.otros_proyectos,          0) AS otros_proyectos,
      COALESCE(rwg.total_wos,               0) AS total_wos_global
    FROM usuario u
    INNER JOIN rol r              ON u.rol_id        = r.rol_id
    INNER JOIN usuario_programa up ON up.usuario_id  = u.usuario_id
    INNER JOIN rol_academico ra    ON ra.rolaca_id   = up.rolaca_id
    LEFT  JOIN reporte_academico rm
      ON rm.usuario_id  = u.usuario_id
      AND rm.programa_id = up.programa_id
    LEFT  JOIN reporte_wos_global rwg
      ON rwg.tipo_academico = ra.tipo_academico
      AND rwg.programa_id   = up.programa_id
    WHERE r.rol_id        = 3
      AND up.programa_id  = ?
    ORDER BY ra.rolaca_id, u.primer_apellido, u.primer_nombre
  `, [programa_id]);
  return rows;
}

export async function updateReporteGeneral(data, programa_id) {
  for (const item of data) {
    await pool.query(`
      INSERT INTO reporte_academico (
        usuario_id, programa_id,
        total_wos_scopus_5_anios, total_scielo_5_anios,
        otros_articulos, libros_area, libros_otro,
        cap_area, cap_otro, edicion_area, edicion_otro,
        proyectos_fondecyt, otros_proyectos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_wos_scopus_5_anios = VALUES(total_wos_scopus_5_anios),
        total_scielo_5_anios     = VALUES(total_scielo_5_anios),
        otros_articulos          = VALUES(otros_articulos),
        libros_area              = VALUES(libros_area),
        libros_otro              = VALUES(libros_otro),
        cap_area                 = VALUES(cap_area),
        cap_otro                 = VALUES(cap_otro),
        edicion_area             = VALUES(edicion_area),
        edicion_otro             = VALUES(edicion_otro),
        proyectos_fondecyt       = VALUES(proyectos_fondecyt),
        otros_proyectos          = VALUES(otros_proyectos)
    `, [
      item.usuario_id,             programa_id,
      item.total_wos_scopus_5_anios, item.total_scielo_5_anios,
      item.otros_articulos,          item.libros_area,
      item.libros_otro,              item.cap_area,
      item.cap_otro,                 item.edicion_area,
      item.edicion_otro,             item.proyectos_fondecyt,
      item.otros_proyectos,
    ]);
  }
}

export async function updateWosGlobal(tipo, total, programa_id) {
  await pool.query(`
    INSERT INTO reporte_wos_global (programa_id, tipo_academico, total_wos)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE total_wos = VALUES(total_wos)
  `, [programa_id, tipo, total]);
}