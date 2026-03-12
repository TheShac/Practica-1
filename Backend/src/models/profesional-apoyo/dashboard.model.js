import { pool } from "../../config/db.js";

export async function getUltimasActualizaciones(limit = 10) {
    const [rows] = await pool.query(`
        SELECT * FROM (
        SELECT
            u.usuario_id,
            CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre_academico,
            ra.tipo_academico AS tipo_contrato,
            'Publicaciones' AS modulo,
            p.created_at AS fecha
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
            l.created_at
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
            cl.created_at
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
            i.created_at
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
            t.created_at
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
            pa.created_at
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
            pi.created_at
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
            co.created_at
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