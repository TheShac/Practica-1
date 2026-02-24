import { pool } from "../../config/db.js";

export async function findUserByRutOrEmail(rut) {
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
    correo,
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
      correo,
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
      u.correo,
      ra.tipo_academico AS contrato
    FROM usuario u
    JOIN rol r ON r.rol_id = u.rol_id
    LEFT JOIN rol_academico ra ON ra.rolaca_id = u.rolaca_id
    WHERE r.nombre = 'Academico'
    ORDER BY u.primer_apellido ASC
    `
  );

  return rows;
}

export async function getAcademicoProfileById(usuario_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      u.usuario_id,
      u.rut,
      u.primer_nombre,
      u.segundo_nombre,
      u.primer_apellido,
      u.segundo_apellido,
      u.correo,
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

  return rows[0] || null;
}

export async function updateAcademicoProfile(usuario_id, data) {
  const {
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    telefono,
    lineas_investigacion,
  } = data;

  await pool.query(
    `
    UPDATE usuario
    SET primer_nombre = ?,
        segundo_nombre = ?,
        primer_apellido = ?,
        segundo_apellido = ?,
        telefono = ?,
        lineas_investigacion = ?
    WHERE usuario_id = ?
    `,
    [
      primer_nombre,
      segundo_nombre || null,
      primer_apellido,
      segundo_apellido || null,
      telefono || null,
      lineas_investigacion || null,
      usuario_id,
    ]
  );
}