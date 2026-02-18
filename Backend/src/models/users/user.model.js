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
  const {
    rut,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    lineas_investigacion,
    rol_id,
    rolaca_id,
  } = data;

  await pool.query(
    `
    UPDATE usuario
    SET rut = ?, primer_nombre = ?, segundo_nombre = ?,
        primer_apellido = ?, segundo_apellido = ?,
        lineas_investigacion = ?,
        rol_id = ?, rolaca_id = ?
    WHERE usuario_id = ?
    `,
    [
      rut,
      primer_nombre,
      segundo_nombre || null,
      primer_apellido,
      segundo_apellido || null,
      lineas_investigacion,
      rol_id,
      rolaca_id || null,
      usuario_id,
    ]
  );
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