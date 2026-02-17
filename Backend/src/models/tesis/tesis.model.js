import { pool } from "../../config/db.js";

export async function getTesisByUsuario(usuario_id, nivel_programa) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM tesis
    WHERE usuario_id = ?
      AND nivel_programa = ?
    ORDER BY ano DESC
    `,
    [usuario_id, nivel_programa]
  );

  return rows;
}

export async function createTesis(data) {
  const {
    usuario_id,
    titulo_tesis,
    nombre_programa,
    institucion,
    ano,
    autor,
    link_verificacion,
    rol_guia,
    nivel_programa,
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO tesis
    (usuario_id, titulo_tesis, nombre_programa, institucion,
     ano, autor, link_verificacion, rol_guia, nivel_programa)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      usuario_id,
      titulo_tesis,
      nombre_programa,
      institucion,
      ano,
      autor,
      link_verificacion || null,
      rol_guia,
      nivel_programa,
    ]
  );

  return result.insertId;
}

export async function updateTesis(tesis_id, data) {
  const {
    titulo_tesis,
    nombre_programa,
    institucion,
    ano,
    autor,
    link_verificacion,
    rol_guia,
  } = data;

  await pool.query(
    `
    UPDATE tesis
    SET titulo_tesis = ?,
        nombre_programa = ?,
        institucion = ?,
        ano = ?,
        autor = ?,
        link_verificacion = ?,
        rol_guia = ?
    WHERE tesis_id = ?
    `,
    [
      titulo_tesis,
      nombre_programa,
      institucion,
      ano,
      autor,
      link_verificacion || null,
      rol_guia,
      tesis_id,
    ]
  );
}

export async function deleteTesis(tesis_id) {
  await pool.query(
    `DELETE FROM tesis WHERE tesis_id = ?`,
    [tesis_id]
  );
}