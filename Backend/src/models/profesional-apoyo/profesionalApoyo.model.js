import { pool } from "../../config/db.js";

export async function getReporteGeneral() {

  const [rows] = await pool.query(`
    SELECT 
        u.usuario_id,
        u.primer_nombre,
        u.primer_apellido,
        u.ano_ingreso,
        ra.tipo_academico,

        COALESCE(rm.total_wos_scopus_5_anios, 0) AS total_wos_scopus_5_anios,
        COALESCE(rm.total_scielo_5_anios, 0) AS total_scielo_5_anios,
        COALESCE(rm.otros_articulos, 0) AS otros_articulos,
        COALESCE(rm.libros_area, 0) AS libros_area,
        COALESCE(rm.libros_otro, 0) AS libros_otro,
        COALESCE(rm.cap_area, 0) AS cap_area,
        COALESCE(rm.cap_otro, 0) AS cap_otro,
        COALESCE(rm.edicion_area, 0) AS edicion_area,
        COALESCE(rm.edicion_otro, 0) AS edicion_otro,
        COALESCE(rm.proyectos_fondecyt, 0) AS proyectos_fondecyt,
        COALESCE(rm.otros_proyectos, 0) AS otros_proyectos,

        COALESCE(rwg.total_wos, 0) AS total_wos_global

    FROM usuario u

    INNER JOIN rol r 
        ON u.rol_id = r.rol_id

    INNER JOIN rol_academico ra 
        ON u.rolaca_id = ra.rolaca_id

    LEFT JOIN reporte_academico rm
        ON u.usuario_id = rm.usuario_id
    
    LEFT JOIN reporte_wos_global rwg
        ON ra.tipo_academico = rwg.tipo_academico

    WHERE r.rol_id = 3

    ORDER BY 
        ra.rolaca_id,
        u.primer_apellido,
        u.primer_nombre
  `);

  return rows;
}

export async function updateReporteGeneral(data) {

  for (const item of data) {

    await pool.query(`
      INSERT INTO reporte_academico (
        usuario_id,
        total_wos_scopus_5_anios,
        total_scielo_5_anios,
        otros_articulos,
        libros_area,
        libros_otro,
        cap_area,
        cap_otro,
        edicion_area,
        edicion_otro,
        proyectos_fondecyt,
        otros_proyectos
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_wos_scopus_5_anios = VALUES(total_wos_scopus_5_anios),
        total_scielo_5_anios = VALUES(total_scielo_5_anios),
        otros_articulos = VALUES(otros_articulos),
        libros_area = VALUES(libros_area),
        libros_otro = VALUES(libros_otro),
        cap_area = VALUES(cap_area),
        cap_otro = VALUES(cap_otro),
        edicion_area = VALUES(edicion_area),
        edicion_otro = VALUES(edicion_otro),
        proyectos_fondecyt = VALUES(proyectos_fondecyt),
        otros_proyectos = VALUES(otros_proyectos)
    `, [
      item.usuario_id,
      item.total_wos_scopus_5_anios,
      item.total_scielo_5_anios,
      item.otros_articulos,
      item.libros_area,
      item.libros_otro,
      item.cap_area,
      item.cap_otro,
      item.edicion_area,
      item.edicion_otro,
      item.proyectos_fondecyt,
      item.otros_proyectos
    ]);

  }
}

export async function updateWosGlobal(tipo, total) {
  await pool.query(`
    INSERT INTO reporte_wos_global (tipo_academico, total_wos)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      total_wos = VALUES(total_wos)
  `, [tipo, total]);
}