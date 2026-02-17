import { pool } from "../../config/db.js";

export async function getInvestigacionesByUsuario(usuario_id) {
  const [rows] = await pool.query(
    `SELECT * FROM investigacion
     WHERE usuario_id = ?
     ORDER BY ano_adjudicacion DESC`,
    [usuario_id]
  );

  return rows;
}

export async function createInvestigacion(data) {
  const {
    usuario_id,
    titulo,
    fuente_financiamiento,
    ano_adjudicacion,
    periodo_ejecucion,
    rol_proyecto,
    link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO investigacion
    (usuario_id, titulo, fuente_financiamiento,
     ano_adjudicacion, periodo_ejecucion,
     rol_proyecto, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    ]
  );

  return result.insertId;
}

export async function updateInvestigacion(id, data) {
  await pool.query(
    `UPDATE investigacion SET ?
     WHERE investigacion_id = ?`,
    [data, id]
  );
}

export async function deleteInvestigacion(id) {
  await pool.query(
    `DELETE FROM investigacion
     WHERE investigacion_id = ?`,
    [id]
  );
}
