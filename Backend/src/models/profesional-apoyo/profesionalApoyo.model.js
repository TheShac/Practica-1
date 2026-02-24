import { pool } from "../../config/db.js";

export async function getReporteGeneral() {
  const [rows] = await pool.query(`
    SELECT 
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre,
        ra.tipo_academico,

        COUNT(p.publicacion_id) AS total_wos_scopus_5_anios

    FROM usuario u

    JOIN rol r ON u.rol_id = r.rol_id
    LEFT JOIN rol_academico ra ON u.rolaca_id = ra.rolaca_id

    LEFT JOIN publicaciones p 
        ON p.usuario_id = u.usuario_id
        AND p.ano >= YEAR(CURDATE()) - 4
        AND p.autor_principal = CONCAT(u.primer_nombre, ' ', u.primer_apellido)

    LEFT JOIN categoria c 
        ON p.categoria_id = c.categoria_id
        AND c.nombre IN ('WoS', 'SCOPUS')

    WHERE r.nombre = 'Academico'

    GROUP BY u.usuario_id, ra.tipo_academico
    ORDER BY ra.tipo_academico, nombre
  `);

  return rows;
}