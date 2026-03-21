import { pool } from "../../config/db.js";

export async function getUltimasActualizaciones(limit = 10) {
  const [rows] = await pool.query(`
    SELECT * FROM (

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre_academico,
        ra.tipo_academico AS tipo_contrato,
        'Publicaciones' AS modulo,
        GREATEST(p.created_at, p.updated_at) AS fecha,
        IF(p.updated_at > p.created_at, 'Actualizado', 'Creado') AS accion
      FROM publicaciones p
      JOIN usuario u ON u.usuario_id = p.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

      UNION ALL

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ra.tipo_academico,
        'Libros',
        GREATEST(l.created_at, l.updated_at),
        IF(l.updated_at > l.created_at, 'Actualizado', 'Creado')
      FROM libro l
      JOIN usuario u ON u.usuario_id = l.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

      UNION ALL

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ra.tipo_academico,
        'Capítulos de Libro',
        GREATEST(cl.created_at, cl.updated_at),
        IF(cl.updated_at > cl.created_at, 'Actualizado', 'Creado')
      FROM cap_libro cl
      JOIN usuario u ON u.usuario_id = cl.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

      UNION ALL

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ra.tipo_academico,
        'Investigación',
        GREATEST(i.created_at, i.updated_at),
        IF(i.updated_at > i.created_at, 'Actualizado', 'Creado')
      FROM investigacion i
      JOIN usuario u ON u.usuario_id = i.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

      UNION ALL

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ra.tipo_academico,
        'Tesis',
        GREATEST(t.created_at, t.updated_at),
        IF(t.updated_at > t.created_at, 'Actualizado', 'Creado')
      FROM tesis t
      JOIN usuario u ON u.usuario_id = t.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

      UNION ALL

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ra.tipo_academico,
        'Patentes',
        GREATEST(pa.created_at, pa.updated_at),
        IF(pa.updated_at > pa.created_at, 'Actualizado', 'Creado')
      FROM patente pa
      JOIN usuario u ON u.usuario_id = pa.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

      UNION ALL

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ra.tipo_academico,
        'Proyectos de Intervención',
        GREATEST(pi.created_at, pi.updated_at),
        IF(pi.updated_at > pi.created_at, 'Actualizado', 'Creado')
      FROM proyectos_intervencion pi
      JOIN usuario u ON u.usuario_id = pi.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

      UNION ALL

      SELECT
        u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ra.tipo_academico,
        'Consultorías',
        GREATEST(co.created_at, co.updated_at),
        IF(co.updated_at > co.created_at, 'Actualizado', 'Creado')
      FROM consultorias co
      JOIN usuario u ON u.usuario_id = co.usuario_id
      LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
      WHERE u.rol_id = 3

    ) AS actividad
    ORDER BY fecha DESC
    LIMIT ${limit}
  `);

  return rows;
}