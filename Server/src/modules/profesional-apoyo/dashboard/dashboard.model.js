import { pool } from '../../../config/db.js';

const programasSubquery = `
  (SELECT GROUP_CONCAT(
    CONCAT(p.nombre, ' - ', ra.tipo_academico)
    ORDER BY p.nombre
    SEPARATOR ', ')
   FROM usuario_programa up
   JOIN programa p        ON p.programa_id   = up.programa_id
   JOIN rol_academico ra  ON ra.rolaca_id     = up.rolaca_id
   WHERE up.usuario_id = u.usuario_id)
`;

export async function getUltimasActualizaciones(limit = 10) {
  const [rows] = await pool.query(`
    SELECT * FROM (
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre_academico,
        ${programasSubquery} AS tipo_contrato,
        'Publicaciones' AS modulo,
        GREATEST(p.created_at, p.updated_at) AS fecha,
        IF(p.updated_at > p.created_at, 'Actualizado', 'Creado') AS accion
      FROM publicaciones p
      JOIN usuario u ON u.usuario_id = p.usuario_id
      WHERE u.rol_id = 3
 
      UNION ALL
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ${programasSubquery},
        'Libros',
        GREATEST(l.created_at, l.updated_at),
        IF(l.updated_at > l.created_at, 'Actualizado', 'Creado')
      FROM libro l
      JOIN usuario u ON u.usuario_id = l.usuario_id
      WHERE u.rol_id = 3
 
      UNION ALL
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ${programasSubquery},
        'Capítulos de Libro',
        GREATEST(cl.created_at, cl.updated_at),
        IF(cl.updated_at > cl.created_at, 'Actualizado', 'Creado')
      FROM cap_libro cl
      JOIN usuario u ON u.usuario_id = cl.usuario_id
      WHERE u.rol_id = 3
 
      UNION ALL
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ${programasSubquery},
        'Investigación',
        GREATEST(i.created_at, i.updated_at),
        IF(i.updated_at > i.created_at, 'Actualizado', 'Creado')
      FROM investigacion i
      JOIN usuario u ON u.usuario_id = i.usuario_id
      WHERE u.rol_id = 3
 
      UNION ALL
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ${programasSubquery},
        'Tesis',
        GREATEST(t.created_at, t.updated_at),
        IF(t.updated_at > t.created_at, 'Actualizado', 'Creado')
      FROM tesis t
      JOIN usuario u ON u.usuario_id = t.usuario_id
      WHERE u.rol_id = 3
 
      UNION ALL
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ${programasSubquery},
        'Patentes',
        GREATEST(pa.created_at, pa.updated_at),
        IF(pa.updated_at > pa.created_at, 'Actualizado', 'Creado')
      FROM patente pa
      JOIN usuario u ON u.usuario_id = pa.usuario_id
      WHERE u.rol_id = 3
 
      UNION ALL
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ${programasSubquery},
        'Proyectos de Intervención',
        GREATEST(pi.created_at, pi.updated_at),
        IF(pi.updated_at > pi.created_at, 'Actualizado', 'Creado')
      FROM proyectos_intervencion pi
      JOIN usuario u ON u.usuario_id = pi.usuario_id
      WHERE u.rol_id = 3
 
      UNION ALL
 
      SELECT u.usuario_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido),
        ${programasSubquery},
        'Consultorías',
        GREATEST(co.created_at, co.updated_at),
        IF(co.updated_at > co.created_at, 'Actualizado', 'Creado')
      FROM consultorias co
      JOIN usuario u ON u.usuario_id = co.usuario_id
      WHERE u.rol_id = 3
 
    ) AS actividad
    ORDER BY fecha DESC
    LIMIT ${limit}
  `);
  return rows;
}