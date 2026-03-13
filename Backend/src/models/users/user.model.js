import { pool } from "../../config/db.js";

export async function findUserByRut(rut) {
  const [rows] = await pool.query(
    `
    SELECT u.*, r.nombre AS rol_nombre
    FROM usuario u
    JOIN rol r ON r.rol_id = u.rol_id
    WHERE u.rut = ?
    LIMIT 1
    `,
    [rut]
  );
  return rows[0] || null;
}

export async function findUserById(usuario_id) {
  const [rows] = await pool.query(
    `
    SELECT u.usuario_id, u.rut, u.primer_nombre, u.segundo_nombre,
           u.primer_apellido, u.segundo_apellido,
           u.lineas_investigacion, u.rol_id, r.nombre AS rol_nombre, u.rolaca_id
    FROM usuario u
    JOIN rol r ON r.rol_id = u.rol_id
    WHERE u.usuario_id = ?
    `,
    [usuario_id]
  );
  return rows[0] || null;
}

export async function listUsers() {
  const [rows] = await pool.query(
    `
    SELECT u.usuario_id, u.rut, u.primer_nombre, u.segundo_nombre,
           u.primer_apellido, u.segundo_apellido,
           u.lineas_investigacion, u.rol_id, r.nombre AS rol_nombre, u.rolaca_id
    FROM usuario u
    JOIN rol r ON r.rol_id = u.rol_id
    ORDER BY u.usuario_id DESC
    `
  );
  return rows;
}

export async function createUser(data) {
  const {
    rut,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    contrasena_hash,
    lineas_investigacion,
    rol_id,
    rolaca_id,
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO usuario
      (rut, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
       contrasena, lineas_investigacion, rol_id, rolaca_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      rut,
      primer_nombre,
      segundo_nombre || null,
      primer_apellido,
      segundo_apellido || null,
      contrasena_hash,
      lineas_investigacion,
      rol_id,
      rolaca_id || null,
    ]
  );

  return result.insertId;
}

export async function updateUser(usuario_id, data) {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  if (fields.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  values.push(usuario_id);

  const sql = `
    UPDATE usuario
    SET ${fields.join(", ")}
    WHERE usuario_id = ?
  `;

  await pool.query(sql, values);
}

export async function updateUserPassword(usuario_id, contrasena_hash) {
  await pool.query(
    `UPDATE usuario SET contrasena = ? WHERE usuario_id = ?`,
    [contrasena_hash, usuario_id]
  );
}

export async function deleteUser(usuario_id) {
  await pool.query(`DELETE FROM usuario WHERE usuario_id = ?`, [usuario_id]);
}

export async function getRoleIdByName(roleName) {
  const [rows] = await pool.query(`SELECT rol_id FROM rol WHERE nombre = ? LIMIT 1`, [roleName]);
  return rows[0]?.rol_id || null;
}

export async function listRoles() {
  const [rows] = await pool.query(`SELECT rol_id, nombre FROM rol ORDER BY rol_id`);
  return rows;
}

export async function listRolesAcademico() {
  const [rows] = await pool.query(`SELECT rolaca_id, tipo_academico FROM rol_academico ORDER BY rolaca_id`);
  return rows;
}

// ── ROL ──────────────────────────────────────────────────
export async function createRol(nombre) {
  const [result] = await pool.query(`INSERT INTO rol (nombre) VALUES (?)`, [nombre]);
  return result.insertId;
}

export async function updateRol(rol_id, nombre) {
  await pool.query(`UPDATE rol SET nombre = ? WHERE rol_id = ?`, [nombre, rol_id]);
}

export async function deleteRol(rol_id) {
  await pool.query(`DELETE FROM rol WHERE rol_id = ?`, [rol_id]);
}

// ── ROL ACADÉMICO ────────────────────────────────────────
export async function createRolAcademico(tipo_academico) {
  const [result] = await pool.query(`INSERT INTO rol_academico (tipo_academico) VALUES (?)`, [tipo_academico]);
  return result.insertId;
}

export async function updateRolAcademico(rolaca_id, tipo_academico) {
  await pool.query(`UPDATE rol_academico SET tipo_academico = ? WHERE rolaca_id = ?`, [tipo_academico, rolaca_id]);
}

export async function deleteRolAcademico(rolaca_id) {
  await pool.query(`DELETE FROM rol_academico WHERE rolaca_id = ?`, [rolaca_id]);
}

export async function listAcademicos() {
  const [rows] = await pool.query(
    `
    SELECT 
      u.usuario_id,
      u.rut,
      u.primer_nombre,
      u.segundo_nombre,
      u.primer_apellido,
      u.segundo_apellido,
      u.ano_ingreso,
      u.lineas_investigacion,
      ra.tipo_academico AS contrato,

      (
        SELECT GROUP_CONCAT(m.mail SEPARATOR '||')
        FROM mail m
        WHERE m.usuario_id = u.usuario_id
      ) AS correos,

      (
        SELECT ga.nombre_grado
        FROM grado_academico ga
        WHERE ga.usuario_id = u.usuario_id
        LIMIT 1
      ) AS nombre_grado,

      (
        SELECT ga.institucion_grado
        FROM grado_academico ga
        WHERE ga.usuario_id = u.usuario_id
        LIMIT 1
      ) AS institucion_grado,

      (
        SELECT ga.ano_grado
        FROM grado_academico ga
        WHERE ga.usuario_id = u.usuario_id
        LIMIT 1
      ) AS ano_grado,

      (
        SELECT GROUP_CONCAT(
          CONCAT(
            t.titulo, '##',
            t.institucion_titulacion, '##',
            t.ano_titulacion, '##',
            t.pais_titulacion
          )
          SEPARATOR '||'
        )
        FROM titulacion t
        WHERE t.usuario_id = u.usuario_id
      ) AS titulaciones

    FROM usuario u
    JOIN rol r ON r.rol_id = u.rol_id
    LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
    WHERE r.nombre = 'Academico'
    ORDER BY u.primer_apellido ASC;
    `
  );

  return rows;
}

export async function getAcademicoFullProfile(usuario_id) {
  const [userRows] = await pool.query(
    `
    SELECT 
      u.usuario_id,
      u.rut,
      u.primer_nombre,
      u.segundo_nombre,
      u.primer_apellido,
      u.segundo_apellido,
      u.ano_ingreso,
      u.lineas_investigacion,
      u.telefono,
      r.nombre AS rol_nombre,
      ra.tipo_academico AS contrato
    FROM usuario u
    JOIN rol r ON r.rol_id = u.rol_id
    LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
    WHERE u.usuario_id = ?
      AND r.nombre = 'Academico'
    `,
    [usuario_id]
  );

  if (userRows.length === 0) return null;

  const usuario = userRows[0];

  const [correos] = await pool.query(
    `SELECT mail FROM mail WHERE usuario_id = ?`,
    [usuario_id]
  );

  const [titulaciones] = await pool.query(
    `
    SELECT titulo, institucion_titulacion, pais_titulacion, ano_titulacion
    FROM titulacion
    WHERE usuario_id = ?
    ORDER BY ano_titulacion DESC
    `,
    [usuario_id]
  );

  const [gradoRows] = await pool.query(
    `
    SELECT nombre_grado, institucion_grado, pais_grado, ano_grado
    FROM grado_academico
    WHERE usuario_id = ?
    `,
    [usuario_id]
  );

  return {
    usuario,
    correos,
    titulaciones,
    grado_academico: gradoRows[0] || null,
  };
}

export async function updateAcademicoProfile(usuario_id, data) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      telefono,
      lineas_investigacion,
      ano_ingreso,
      correos = [],
      grado_academico,
      titulaciones = []
    } = data;

    await connection.query(
      `
      UPDATE usuario
      SET primer_nombre = ?,
          segundo_nombre = ?,
          primer_apellido = ?,
          segundo_apellido = ?,
          telefono = ?,
          lineas_investigacion = ?,
          ano_ingreso = ?
      WHERE usuario_id = ?
      `,
      [
        primer_nombre,
        segundo_nombre || null,
        primer_apellido,
        segundo_apellido || null,
        telefono || null,
        lineas_investigacion || null,
        ano_ingreso || null,
        usuario_id
      ]
    );

    const [existingMails] = await connection.query(
      `SELECT mail_id FROM mail WHERE usuario_id = ?`,
      [usuario_id]
    );

    const existingMailIds = existingMails.map(m => m.mail_id);
    const incomingMailIds = correos
      .filter(m => m.mail_id)
      .map(m => m.mail_id);

    for (const id of existingMailIds) {
      if (!incomingMailIds.includes(id)) {
        await connection.query(
          `DELETE FROM mail WHERE mail_id = ?`,
          [id]
        );
      }
    }

    for (const m of correos) {
      const mailClean = m.mail?.trim();
      if (!mailClean) continue;

      if (m.mail_id) {
        await connection.query(
          `UPDATE mail SET mail = ? WHERE mail_id = ?`,
          [mailClean, m.mail_id]
        );
      } else {
        await connection.query(
          `INSERT INTO mail (mail, usuario_id) VALUES (?, ?)`,
          [mailClean, usuario_id]
        );
      }
    }

    if (grado_academico?.nombre_grado) {
      await connection.query(
        `
        INSERT INTO grado_academico
          (usuario_id, nombre_grado, institucion_grado, pais_grado, ano_grado)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nombre_grado = VALUES(nombre_grado),
          institucion_grado = VALUES(institucion_grado),
          pais_grado = VALUES(pais_grado),
          ano_grado = VALUES(ano_grado)
        `,
        [
          usuario_id,
          grado_academico.nombre_grado,
          grado_academico.institucion_grado || null,
          grado_academico.pais_grado || null,
          grado_academico.ano_grado || null
        ]
      );
    }

    const [existingTit] = await connection.query(
      `SELECT titulo_id FROM titulacion WHERE usuario_id = ?`,
      [usuario_id]
    );

    const existingTitIds = existingTit.map(t => t.titulo_id);
    const incomingTitIds = titulaciones
      .filter(t => t.titulo_id)
      .map(t => t.titulo_id);

    for (const id of existingTitIds) {
      if (!incomingTitIds.includes(id)) {
        await connection.query(
          `DELETE FROM titulacion WHERE titulo_id = ?`,
          [id]
        );
      }
    }

    for (const t of titulaciones) {
      const tituloClean = t.titulo?.trim();
      if (!tituloClean) continue;

      if (t.titulo_id) {
        await connection.query(
          `
          UPDATE titulacion
          SET titulo = ?,
              institucion_titulacion = ?,
              pais_titulacion = ?,
              ano_titulacion = ?
          WHERE titulo_id = ?
          `,
          [
            tituloClean,
            t.institucion_titulacion || null,
            t.pais_titulacion || null,
            t.ano_titulacion || null,
            t.titulo_id
          ]
        );
      } else {
        await connection.query(
          `
          INSERT INTO titulacion
            (usuario_id, titulo, institucion_titulacion, pais_titulacion, ano_titulacion)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            usuario_id,
            tituloClean,
            t.institucion_titulacion || null,
            t.pais_titulacion || null,
            t.ano_titulacion || null
          ]
        );
      }
    }

    await connection.commit();

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}