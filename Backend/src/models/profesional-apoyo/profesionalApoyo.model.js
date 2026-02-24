import { pool } from "../../config/db.js";

export async function getReporteGeneral() {
  const [rows] = await pool.query(`
    SELECT 
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre,
        ra.tipo_academico,

        COUNT(
          DISTINCT CASE
            WHEN c.nombre IN ('WoS', 'SCOPUS')
            AND p.ano >= YEAR(CURDATE()) - 4
            AND p.autor_principal = CONCAT(u.primer_nombre, ' ', u.primer_apellido)
            THEN p.publicacion_id
          END
        ) AS total_wos_scopus_5_anios,

        COUNT(
          DISTINCT CASE
            WHEN c.nombre IN ('Scielo', 'Latindex', 'ERIH')
            AND p.ano >= YEAR(CURDATE()) - 4
            AND p.autor_principal = CONCAT(u.primer_nombre, ' ', u.primer_apellido)
            THEN p.publicacion_id
          END
        ) AS total_scielo_5_anios

    FROM usuario u

    JOIN rol r 
      ON u.rol_id = r.rol_id

    LEFT JOIN rol_academico ra 
      ON u.rolaca_id = ra.rolaca_id

    LEFT JOIN publicaciones p 
      ON p.usuario_id = u.usuario_id

    LEFT JOIN categoria c 
      ON p.categoria_id = c.categoria_id

    WHERE r.nombre = 'Academico'

    GROUP BY 
      u.usuario_id,
      ra.tipo_academico,
      u.primer_nombre,
      u.primer_apellido

    ORDER BY 
      ra.tipo_academico,
      nombre
  `);

  return rows;
}