import { pool } from '../../config/db.js';

export async function getInvestigacionesByUsuario(usuario_id) {
  const [rows] = await pool.query(
    `SELECT * FROM investigacion
     WHERE usuario_id = ?
     ORDER BY ano_adjudicacion DESC`,
    [usuario_id]
  );
  return rows;
}

export async function getInvestigacionById(investigacion_id) {
  const [rows] = await pool.query(
    `SELECT * FROM investigacion WHERE investigacion_id = ? LIMIT 1`,
    [investigacion_id]
  );
  return rows[0] || null;
}

export async function createInvestigacion(data) {
  const {
    usuario_id, titulo, fuente_financiamiento,
    ano_adjudicacion, periodo_ejecucion,
    rol_proyecto, link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO investigacion
       (usuario_id, titulo, fuente_financiamiento,
        ano_adjudicacion, periodo_ejecucion,
        rol_proyecto, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id, titulo,
      fuente_financiamiento || null,
      ano_adjudicacion      || null,
      periodo_ejecucion     || null,
      rol_proyecto          || null,
      link_verificacion     || null,
    ]
  );
  return result.insertId;
}

export async function updateInvestigacion(investigacion_id, data) {
  const {
    titulo, fuente_financiamiento,
    ano_adjudicacion, periodo_ejecucion,
    rol_proyecto, link_verificacion,
  } = data;

  await pool.query(
    `UPDATE investigacion
     SET titulo                = ?,
         fuente_financiamiento = ?,
         ano_adjudicacion      = ?,
         periodo_ejecucion     = ?,
         rol_proyecto          = ?,
         link_verificacion     = ?
     WHERE investigacion_id = ?`,
    [
      titulo,
      fuente_financiamiento || null,
      ano_adjudicacion      || null,
      periodo_ejecucion     || null,
      rol_proyecto          || null,
      link_verificacion     || null,
      investigacion_id,
    ]
  );
}

export async function deleteInvestigacion(investigacion_id) {
  await pool.query(
    `DELETE FROM investigacion WHERE investigacion_id = ?`,
    [investigacion_id]
  );
}