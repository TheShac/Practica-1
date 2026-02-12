import { pool } from "../../config/db.js";

export async function findUserByRutOrEmail(identifier) {
  const [rows] = await pool.query(
    `
    SELECT u.*, r.nombre AS rol_nombre
    FROM usuario u
    JOIN rol r ON r.rol_id = u.rol_id
    WHERE u.rut = ? OR u.correo = ?
    LIMIT 1
    `,
    [identifier, identifier]
  );
  return rows[0] || null;
}

export async function findUserById(usuario_id) {
  const [rows] = await pool.query(
    `
    SELECT u.usuario_id, u.rut, u.primer_nombre, u.segundo_nombre,
           u.primer_apellido, u.segundo_apellido, u.correo,
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
           u.primer_apellido, u.segundo_apellido, u.correo,
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
       correo, contrasena, lineas_investigacion, rol_id, rolaca_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  const {
    rut,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    correo,
    lineas_investigacion,
    rol_id,
    rolaca_id,
  } = data;

  await pool.query(
    `
    UPDATE usuario
    SET rut = ?, primer_nombre = ?, segundo_nombre = ?,
        primer_apellido = ?, segundo_apellido = ?,
        correo = ?, lineas_investigacion = ?,
        rol_id = ?, rolaca_id = ?
    WHERE usuario_id = ?
    `,
    [
      rut,
      primer_nombre,
      segundo_nombre || null,
      primer_apellido,
      segundo_apellido || null,
      correo,
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