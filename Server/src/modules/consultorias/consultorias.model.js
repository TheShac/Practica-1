import { pool } from '../../config/db.js';

export async function getConsultoriasByUsuario(usuario_id) {
  const [rows] = await pool.query(
    `SELECT * FROM consultorias
     WHERE usuario_id = ?
     ORDER BY ano_adjudicacion DESC`,
    [usuario_id]
  );
  return rows;
}

export async function getConsultoriaById(consultoria_id) {
  const [rows] = await pool.query(
    `SELECT * FROM consultorias WHERE consultoria_id = ? LIMIT 1`,
    [consultoria_id]
  );
  return rows[0] || null;
}

export async function createConsultoria(usuario_id, data) {
  const {
    titulo, institucion_contratante, ano_adjudicacion,
    periodo_ejecucion, objetivo, link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO consultorias
       (usuario_id, titulo, institucion_contratante, ano_adjudicacion,
        periodo_ejecucion, objetivo, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id, titulo,
      institucion_contratante || null,
      ano_adjudicacion        || null,
      periodo_ejecucion       || null,
      objetivo                || null,
      link_verificacion       || null,
    ]
  );
  return result.insertId;
}

export async function updateConsultoria(consultoria_id, data) {
  const {
    titulo, institucion_contratante, ano_adjudicacion,
    periodo_ejecucion, objetivo, link_verificacion,
  } = data;

  await pool.query(
    `UPDATE consultorias
     SET titulo                  = ?,
         institucion_contratante = ?,
         ano_adjudicacion        = ?,
         periodo_ejecucion       = ?,
         objetivo                = ?,
         link_verificacion       = ?
     WHERE consultoria_id = ?`,
    [
      titulo,
      institucion_contratante || null,
      ano_adjudicacion        || null,
      periodo_ejecucion       || null,
      objetivo                || null,
      link_verificacion       || null,
      consultoria_id,
    ]
  );
}

export async function deleteConsultoria(consultoria_id) {
  await pool.query(
    `DELETE FROM consultorias WHERE consultoria_id = ?`,
    [consultoria_id]
  );
}